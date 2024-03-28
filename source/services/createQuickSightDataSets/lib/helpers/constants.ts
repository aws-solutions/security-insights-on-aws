// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserAgent } from '@aws-sdk/types';

export const USER_AGENT_STRING: UserAgent = [[<string>process.env.USER_AGENT_STRING]];
export const REGION: string = process.env.AWS_REGION || '';
export const PRINCIPAL_ARN = process.env.QUICKSIGHT_PRINCIPAL_ARN || '';
export const ATHENA_WORKGROUP_NAME = process.env.ATHENA_WORKGROUP_NAME || '';
export const DEFAULT_DATABASE_NAME = process.env.DEFAULT_DATABASE_NAME!;
export const SECURITY_LAKE_DATABASE_NAME = process.env.SECURITY_LAKE_DATABASE_NAME!;
export const DEFAULT_VPC_TABLE_NAME = process.env.DEFAULT_VPC_DATATABLE_NAME!;
export const DEFAULT_SECURITY_HUB_TABLE_NAME = process.env.DEFAULT_SECURITY_HUB_DATATABLE_NAME!;
export const DEFAULT_CLOUDTRAIL_TABLE_NAME = process.env.DEFAULT_CLOUDTRAIL_DATATABLE_NAME!;
export const DEFAULT_APP_FABRIC_DATATABLE_NAME = process.env.DEFAULT_APP_FABRIC_DATATABLE_NAME!;
export const SECURITY_LAKE_VPC_TABLE_NAME = process.env.SECURITY_LAKE_VPC_TABLE_NAME!;
export const SECURITY_LAKE_SECURITY_HUB_TABLE_NAME = process.env.SECURITY_LAKE_SECURITY_HUB_TABLE_NAME!;
export const SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME = process.env.SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME!;
export const SECURITY_LAKE_APP_FABRIC_TABLE_NAME = process.env.SECURITY_LAKE_APP_FABRIC_TABLE_NAME!;
export const DEFAULT_QUERY_WINDOW_DURATION = process.env.DEFAULT_QUERY_WINDOW_DURATION!;
export const RESOURCE_LINK_DATABASE_NAME = process.env.RESOURCE_LINK_DATABASE_NAME!;
export const SECURITY_LAKE_ACCOUNT_ID = process.env.SECURITY_LAKE_ACCOUNT_ID!;
export const CURRENT_ACCOUNT_ID = process.env.CURRENT_ACCOUNT_ID!;
export const DATA_SOURCE_VPC_NAME = 'vpcFlowLogs';
export const DATA_SOURCE_CLOUDTRAIL_NAME = 'cloudtrail';
export const DATA_SOURCE_SECURITY_HUB_NAME = 'securityHub';
export const DATA_SOURCE_APP_FABRIC_NAME = 'appfabric';
export const SPICE = 'SPICE';
export const TABLE_ID = '60ace416-784e-4798-8766-58bf09b9faaf';
export const QUERY_WINDOW_DURATION = 'query_window_duration';
export const TEST_DATATABLE_NAME = 'test_datatable_name';
export const TEST_DATABASE_NAME = 'test_database_name';
export const ACTIONS = 'Actions';
export const PRINCIPAL = 'Principal';
export const DELAY_IN_SECONDS_FOR_RATE_LIMITING = process.env.DELAY_IN_SECONDS_FOR_RATE_LIMITING!;
