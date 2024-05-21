// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { logger } from './utils/logger';
import { UserGroupManager } from './lib/resourceManagers/userGroupManager';
import { QuickSightHelper } from './lib/serviceOperations/quickSightHelper';
import { ServiceClientProvider} from './lib/helpers/serviceClientProvider'
import { CfnResponseData } from './utils/cfnResponse/interfaces';
import {
  StatusTypes,
  CustomResource,
  RequestType,
  ResourceProperty,
  USER_AGENT_STRING,
  QUICKSIGHT_ADMIN_REGION,
  QUICKSIGHT_ENDPOINT_REGION,
} from './lib/helpers/constants';
import { DEFAULT_QUICKSIGHT_USER_GROUPS } from './lib/helpers/permissions';
import { QuickSightClient } from '@aws-sdk/client-quicksight';
import { sendCustomResourceResponseToCloudFormation } from './utils/cfnResponse/cfnCustomResource';


export async function handler(
  event: CloudFormationCustomResourceEvent,
): Promise<CfnResponseData | void> {
  logger.debug({
    label: 'handler',
    message: `received event: ${JSON.stringify(event)}`,
  });

  const response: CfnResponseData = {
    Status: StatusTypes.SUCCESS,
    Error: {
      Code: '',
      Message: ''
    },
    Data: {
      AdminGroupArn: '',
      ReadGroupArn: '',
    },
  };

  let serviceClientProviderForAdminRegion: ServiceClientProvider = new ServiceClientProvider(QUICKSIGHT_ADMIN_REGION, USER_AGENT_STRING);
  let quickSightClientForAdminRegion: QuickSightClient = serviceClientProviderForAdminRegion.getQuickSightClient(); // to create user groups in quicksights admin region
  
  let serviceClientProviderForDeploymentRegion: ServiceClientProvider = new ServiceClientProvider(QUICKSIGHT_ENDPOINT_REGION, USER_AGENT_STRING);
  let quickSightClientForDeploymentRegion: QuickSightClient = serviceClientProviderForDeploymentRegion.getQuickSightClient(); // to update dashboard and analysis permissions in the deployment region
  
  let quickSightHelper: QuickSightHelper = new QuickSightHelper(quickSightClientForAdminRegion, quickSightClientForDeploymentRegion)
  const userGroupManager = new UserGroupManager(quickSightHelper);

  try {
    if (event.ResourceType === CustomResource.QUICKSIGHT_USER_GROUPS) {
      if (event.RequestType === RequestType.CREATE) {
        await userGroupManager.handleCreateUserGroups(
          event.ResourceProperties[ResourceProperty.DASHBOARD_ID],
          event.ResourceProperties[ResourceProperty.ANALYSIS_ID],
          DEFAULT_QUICKSIGHT_USER_GROUPS,
          response,
        );
      }
      if (event.RequestType === RequestType.DELETE) {
        await userGroupManager.handleDeleteUserGroups(DEFAULT_QUICKSIGHT_USER_GROUPS);
      }
    }
  } catch (error) {
    response.Status = StatusTypes.FAILED;
    response.Error = {
      Code: error.code ?? 'CustomResourceError',
      Message: error.message ?? 'Custom resource error occurred when creating QuickSight Datasets.',
    };
    logger.error({
      label: 'QuickSightUserGroupManager/Handler',
      message: {
        data: 'Error occurred while creating user groups',
        error: error,
      },
    });
  } finally {
    await sendCustomResourceResponseToCloudFormation(event, response);
  }
}
