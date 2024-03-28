// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import axios, { RawAxiosRequestConfig, AxiosResponse } from 'axios';
import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { logger } from './utils/logger';
import { UserGroupManager } from './lib/resourceManagers/userGroupManager';
import { QuickSightHelper } from './lib/serviceOperations/quickSightHelper';
import { ServiceClientProvider} from './lib/helpers/serviceClientProvider'
import { CompletionStatus } from './lib/helpers/interfaces';
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

export async function handler(
  event: CloudFormationCustomResourceEvent,
  context: Context,
): Promise<CompletionStatus | void> {
  logger.debug({
    label: 'handler',
    message: `received event: ${JSON.stringify(event)}`,
  });

  const response: CompletionStatus = {
    Status: StatusTypes.SUCCESS,
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
    response.Data = error;
    logger.error({
      label: 'handler',
      message: `error: ${JSON.stringify(error)}`,
    });
  } finally {
    await SendCustomResourceResponseToCloudFormation(event, context, response);
  }
}

export async function SendCustomResourceResponseToCloudFormation(
  event: CloudFormationCustomResourceEvent,
  context: Context,
  response: CompletionStatus,
): Promise<AxiosResponse> {
  logger.debug({
    label: 'handler/SendCustomResourceResponseToCloudFormation',
    message: `Send response to custom resource waiting in Cloudformation`,
  });
  const responseBody = JSON.stringify({
    Status: response.Status,
    Reason: `See the details in CloudWatch Log Stream: ${context.logStreamName}`,
    PhysicalResourceId: context.logGroupName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: response.Data,
  });

  const config: RawAxiosRequestConfig = {
    headers: {
      'Content-Type': '',
      'Content-Length': responseBody.length,
    },
  };

  return axios.put(event.ResponseURL, responseBody, config);
}
