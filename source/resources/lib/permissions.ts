// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Aws } from 'aws-cdk-lib';

export const CREATE_LOG_GROUP_PERMISSIONS = ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'];

export const SSM_GET_PARAMETER_PERMISSIONS = ['ssm:GetParameter'];

export const SSM_UPDATE_PARAMETER_PERMISSIONS = ['ssm:PutParameter']

export const CREATE_LAKE_FORMATION_PERMISSIONS = [
  'lakeformation:DescribeResource',
  'lakeformation:ListResources',
  'lakeformation:GrantPermissions',
  'lakeformation:ListPermissions',
  'lakeformation:GetDataLakeSettings',
  'lakeformation:BatchGrantPermissions',
  'lakeformation:PutDataLakeSettings',
  'lakeformation:RevokePermissions'
];

export const CREATE_GLUE_PERMISSIONS = ['glue:CreateDatabase', 'glue:CreateTable'];

export const QUICKSIGHT_DATASOURCE_PERMISSIONS = [
  'quicksight:UpdateDataSourcePermissions',
  'quicksight:DescribeDataSource',
  'quicksight:DescribeDataSourcePermissions',
  'quicksight:PassDataSource',
  'quicksight:UpdateDataSource',
  'quicksight:DeleteDataSource',
];
export const QUICKSIGHT_DATASOURCE_CREATE_PERMISSIONS = ['quicksight:CreateDataSource'];

export const QUICKSIGHT_LIST_INGESTION_PERMISSIONS = ['quicksight:ListIngestions'];

export const QUICKSIGHT_INGESTION_PERMISSIONS = [
  'quicksight:DescribeIngestion',
  'quicksight:CreateIngestion',
  'quicksight:CancelIngestion',
];

export const QUICKSIGHT_DATASET_PERMISSIONS = [
  'quicksight:DescribeDataSet',
  'quicksight:DescribeDataSetPermissions',
  'quicksight:PassDataSet',
  'quicksight:DeleteDataSet',
  'quicksight:UpdateDataSetPermissions',
  'quicksight:CreateDataSet',
  'quicksight:UpdateDataSet',
];

export const QUICKSIGHT_UPDATE_DATASET_PERMISSIONS = ['quicksight:UpdateDataSet'];

export const REFRESH_SCHEDULE_PERMISSIONS = [
  'quicksight:CreateRefreshSchedule',
  'quicksight:DeleteRefreshSchedule',
  'quicksight:UpdateRefreshSchedule',
];

export const GLUE_PERMISSIONS = [
  'glue:CreateDatabase',
  'glue:CreateTable',
  'glue:GetTables',
  'glue:GetTable',
  'glue:GetDatabases',
  'glue:GetDatabase'
];

export const DATA_SET_ARNS = [
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Apps_Failed_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_IP_Address_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Logins_By_Applications`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Suspicious_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Dataset`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Dataset`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_VPC_Flow_Dataset`,
];

export const INGESTION_ARNS = [

  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Apps_Failed_Logins/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_IP_Address_Logins/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Logins_By_Applications/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Suspicious_Logins/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Dataset/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Dataset/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_VPC_Flow_Dataset/ingestion/*`,
];

export const REFRESH_SCHEDULE_ARNS = [
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Apps_Failed_Logins/refresh-schedule/Security_Insights_AppFabric_Apps_Failed_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_IP_Address_Logins/refresh-schedule/Security_Insights_AppFabric_IP_Address_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Logins_By_Applications/refresh-schedule/Security_Insights_AppFabric_Logins_By_Applications`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Suspicious_Logins/refresh-schedule/Security_Insights_AppFabric_Suspicious_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Dataset/refresh-schedule/Security_Insights_Cloudtrail_Dataset`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Dataset/refresh-schedule/Security_Insights_Security_Hub_Dataset`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_VPC_Flow_Dataset/refresh-schedule/Security_Insights_VPC_Flow_Dataset`,
  ];

export const QUICKSIGHT_ANALYSIS_ACTIONS = [
  'quicksight:RestoreAnalysis',
  'quicksight:UpdateAnalysisPermissions',
  'quicksight:DeleteAnalysis',
  'quicksight:DescribeAnalysisPermissions',
  'quicksight:QueryAnalysis',
  'quicksight:DescribeAnalysis',
  'quicksight:UpdateAnalysis',
];

export const QUICKSIGHT_DASHBOARD_ACTIONS = [
  'quicksight:DescribeDashboard',
  'quicksight:ListDashboardVersions',
  'quicksight:UpdateDashboardPermissions',
  'quicksight:QueryDashboard',
  'quicksight:UpdateDashboard',
  'quicksight:DeleteDashboard',
  'quicksight:DescribeDashboardPermissions',
  'quicksight:UpdateDashboardPublishedVersion',
];

export const XRAY_ACTIONS = ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'];

export const CREATE_DESCRIBE_OPS_ITEMS = [
  'ssm:CreateOpsItem',
	'ssm:DescribeOpsItems',
  'ssm:AddTagsToResource'
]

export const UPDATE_OPS_ITEMS = [
  'ssm:AssociateOpsItemRelatedItem',
	'ssm:UpdateOpsItem'
]