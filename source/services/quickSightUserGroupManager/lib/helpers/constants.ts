// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserAgent } from '@aws-sdk/types';

export const QUICKSIGHT_ENDPOINT_REGION = <string>process.env.REGION;
export const MILLISECONDS_PER_SECOND = 1000;
export const ACCOUNT_ID = <string>process.env.ACCOUNT_ID;
export const SOLUTION_ID = <string>process.env.USER_AGENT_PREFIX;
export const SOLUTION_VERSION = <string>process.env.SOLUTION_VERSION;
export const USER_AGENT_STRING: UserAgent = [[<string>process.env.USER_AGENT_STRING]];
export const DEFAULT_QUICKSIGHT_NAMESPACE = 'default';
export const ADMIN_GROUP_ARN: string = 'AdminGroupArn';
export const READ_GROUP_ARN = 'ReadGroupArn';
export const QUICKSIGHT_ADMIN_REGION = <string>process.env.QUICKSIGHT_ADMIN_REGION;

export enum ResourceProperty {
  DASHBOARD_ID = 'DashboardID',
  ANALYSIS_ID = 'AnalysisID',
}

export enum RequestType {
  CREATE = 'Create',
  DELETE = 'Delete',
}

export enum CustomResource {
  QUICKSIGHT_USER_GROUPS = 'Custom::QuickSightUserGroups',
}

export enum StatusTypes {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
export const DELAY_IN_SECONDS_FOR_RATE_LIMITING = process.env.DELAY_IN_SECONDS_FOR_RATE_LIMITING!;
