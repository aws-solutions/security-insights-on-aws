// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import { QuickSightHelper } from '../serviceOperations/quickSightHelper';
import { ANALYSIS_CO_OWNER_PERMISSIONS } from '../helpers/permissions';
import {
  MILLISECONDS_PER_SECOND,
  ACCOUNT_ID,
  DEFAULT_QUICKSIGHT_NAMESPACE,
  DELAY_IN_SECONDS_FOR_RATE_LIMITING,
  QUICKSIGHT_ADMIN_REGION,
} from '../helpers/constants';
import { QuickSightUserGroup, CompletionStatus } from '../helpers/interfaces';
import { createDelayInSeconds } from '../../utils/delay';

export class UserGroupManager {
  constructor(public quickSight: QuickSightHelper) {
    this.quickSight = quickSight;
  }

  handleCreateUserGroups = async (
    dashboardID: string,
    analysisID: string,
    defaultUserGroups: QuickSightUserGroup[],
    handlerResponse: CompletionStatus,
  ) => {
    logger.debug({
      label: 'helper/handleCreateUserGroups',
      message: `Create default Quicksight groups`,
    });
    await this.createUserGroups(defaultUserGroups);
    const groupArns = await this.getGroupArns(defaultUserGroups);
    this.updateHandlerResponse(handlerResponse, groupArns);

    const defaultPermissions = this.getDefaultPermissions(groupArns, defaultUserGroups);
    await this.setupPermissionsForDashboard(dashboardID, defaultPermissions['Dashboard']);
    await this.setupPermissionsForAnalysis(analysisID, defaultPermissions['Analysis']);
  };

  handleDeleteUserGroups = async (defaultUserGroups: QuickSightUserGroup[]) => {
    logger.debug({
      label: 'helper/handleDeleteUserGroups',
      message: `Delete default Quicksight groups`,
    });
    for (const userGroup of defaultUserGroups) {
      await this.quickSight.deleteGroup(userGroup.GroupName);
    }
  };

  createUserGroups = async (userGroups: QuickSightUserGroup[]) => {
    for (const userGroup of userGroups) {
      await this.quickSight.createGroup(userGroup.GroupName, userGroup.GroupDescription);
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
    await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // observed issues with eventually consistent creation of QS groups
  };

  updateHandlerResponse = (handlerResponse: CompletionStatus, groupArns: { [key: string]: string }) => {
    for (const groupName in groupArns) {
      handlerResponse.Data[groupName as keyof typeof handlerResponse.Data] = groupArns[groupName];
    }
  };

  getGroupArns = async (userGroups: QuickSightUserGroup[]) => {
    const groupArns = {
      Admin: '',
      Read: '',
    };
    userGroups.forEach(userGroup => {
      groupArns[
        userGroup.GroupName as keyof typeof groupArns
      ] = `arn:aws:quicksight:${QUICKSIGHT_ADMIN_REGION}:${ACCOUNT_ID}:group/${DEFAULT_QUICKSIGHT_NAMESPACE}/${userGroup.GroupName}`;
    });
    return groupArns;
  };

  getDefaultPermissions = (groupArns: { [key: string]: string }, defaultUserGroups: QuickSightUserGroup[]) => {
    const dashboardPermissions: { [key: string]: string | string[] }[] = [];
    const analysisPermissions: { [key: string]: string | string[] }[] = [];

    dashboardPermissions.push({
      Principal: groupArns[defaultUserGroups[0].GroupName],
      Actions: defaultUserGroups[0].DashboardPermissions,
    });
    dashboardPermissions.push({
      Principal: groupArns[defaultUserGroups[1].GroupName],
      Actions: defaultUserGroups[1].DashboardPermissions,
    });
    analysisPermissions.push({
      Principal: groupArns[defaultUserGroups[0].GroupName],
      Actions: ANALYSIS_CO_OWNER_PERMISSIONS,
    });

    const permissions = {
      Dashboard: dashboardPermissions,
      Analysis: analysisPermissions,
    };
    return permissions;
  };

  setupPermissionsForDashboard = async (
    dashboardID: string,
    dashboardPermissions: { [key: string]: string | string[] }[],
  ) => {
    await this.quickSight.updateDashboardPermissions(dashboardID, dashboardPermissions);
  };

  setupPermissionsForAnalysis = async (
    analysisID: string,
    analysisPermissions: { [key: string]: string | string[] }[],
  ) => {
    await this.quickSight.updateAnalysisPermissions(analysisID, analysisPermissions);
  };

  sleepSeconds = async (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds * MILLISECONDS_PER_SECOND));
  };
}
