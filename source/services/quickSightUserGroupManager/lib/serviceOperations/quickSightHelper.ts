// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import {
  QuickSightClient,
  CreateGroupCommand,
  DeleteGroupCommand,
  UpdateDashboardPermissionsCommand,
  UpdateAnalysisPermissionsCommand,
} from '@aws-sdk/client-quicksight';
import { DEFAULT_QUICKSIGHT_NAMESPACE, ACCOUNT_ID } from '../helpers/constants';

export class QuickSightHelper {
  constructor(
    private quicksightClientAdminRegion: QuickSightClient, 
    private quicksightClientDeploymentRegion: QuickSightClient
  ) {
    this.quicksightClientAdminRegion = quicksightClientAdminRegion;
    this.quicksightClientDeploymentRegion = quicksightClientDeploymentRegion
  }

  updateDashboardPermissions = async (dashboardID: string, grantPermissions: any[]) => {
    logger.debug({
      label: 'QuickSightHelper/updateDashboardPermissions',
      message: `Updating dashboard permissions: ${dashboardID}`,
    });
    return await this.quicksightClientDeploymentRegion.send(
      new UpdateDashboardPermissionsCommand({
        AwsAccountId: ACCOUNT_ID,
        DashboardId: dashboardID,
        GrantPermissions: grantPermissions,
      }),
    );
  };

  updateAnalysisPermissions = async (analysisID: string, grantPermissions: any[]) => {
    logger.debug({
      label: 'QuickSightHelper/updateAnalysisPermissions',
      message: `Updating analysis permissions: ${analysisID}`,
    });
    return await this.quicksightClientDeploymentRegion.send(
      new UpdateAnalysisPermissionsCommand({
        AwsAccountId: ACCOUNT_ID,
        AnalysisId: analysisID,
        GrantPermissions: grantPermissions,
      }),
    );
  };

  deleteGroup = async (groupName: string) => {
    logger.debug({
      label: 'QuickSightHelper/deleteGroup',
      message: `Deleting quicksight group: ${groupName}`,
    });
    return await this.quicksightClientAdminRegion.send(
      new DeleteGroupCommand({
        GroupName: groupName,
        AwsAccountId: ACCOUNT_ID,
        Namespace: DEFAULT_QUICKSIGHT_NAMESPACE,
      }),
    );
  };

  createGroup = async (groupName: string, description: string) => {
    logger.debug({
      label: 'QuickSightHelper/createGroup',
      message: `Creates Quicksight Group named: ${groupName} | ${description}`,
    });
    return await this.quicksightClientAdminRegion.send(
      new CreateGroupCommand({
        GroupName: groupName,
        Description: description,
        AwsAccountId: ACCOUNT_ID,
        Namespace: DEFAULT_QUICKSIGHT_NAMESPACE,
      }),
    );
  };
}

