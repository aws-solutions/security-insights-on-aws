// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Aws } from 'aws-cdk-lib';

export const CREATE_LOG_GROUP_PERMISSIONS = ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'];

export const SSM_GET_PARAMETER_PERMISSIONS = ['ssm:GetParameter'];

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
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Destination_Inbound`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Destination_Outbound`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Source_Inbound`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Source_Outbound`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Total_Bytes_Region`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Findings_By_Severity`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Findings_By_Standards`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_GuardDuty_Findings`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Unresolved_Findings`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Apps_Failed_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_IP_Address_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Logins_By_Applications`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Suspicious_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Accounts_API_Failures`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_API_Failures`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_API_Operations`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Access_Key_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Login_Details`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_KMS_Key_Deletions`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_KMS_Key_Policy_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_NACL_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Operation_Details`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Regions_API_Failures`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Root_Login_Details`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Root_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Route_Table_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Security_Group_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_UID_API_Failures`
];

export const INGESTION_ARNS = [
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Destination_Inbound/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Destination_Outbound/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Source_Inbound/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Source_Outbound/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Total_Bytes_Region/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Findings_By_Severity/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Findings_By_Standards/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_GuardDuty_Findings/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Unresolved_Findings/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Apps_Failed_Logins/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_IP_Address_Logins/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Logins_By_Applications/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Suspicious_Logins/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Accounts_API_Failures/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_API_Failures/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_API_Operations/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Access_Key_Changes/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Login_Details/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Logins/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_KMS_Key_Deletions/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_KMS_Key_Policy_Changes/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_NACL_Changes/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Operation_Details/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Regions_API_Failures/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Root_Login_Details/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Root_Logins/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Route_Table_Changes/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Security_Group_Changes/ingestion/*`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_UID_API_Failures/ingestion/*`
];

export const REFRESH_SCHEDULE_ARNS = [
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Destination_Inbound/refresh-schedule/Security_Insights_Vpc_Flow_Destination_Inbound`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Destination_Outbound/refresh-schedule/Security_Insights_Vpc_Flow_Destination_Outbound`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Source_Inbound/refresh-schedule/Security_Insights_Vpc_Flow_Source_Inbound`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Source_Outbound/refresh-schedule/Security_Insights_Vpc_Flow_Source_Outbound`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Vpc_Flow_Total_Bytes_Region/refresh-schedule/Security_Insights_Vpc_Flow_Total_Bytes_Region`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Findings_By_Severity/refresh-schedule/Security_Insights_Security_Hub_Findings_By_Severity`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Findings_By_Standards/refresh-schedule/Security_Insights_Security_Hub_Findings_By_Standards`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_GuardDuty_Findings/refresh-schedule/Security_Insights_Security_Hub_GuardDuty_Findings`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Unresolved_Findings/refresh-schedule/Security_Insights_Security_Hub_Unresolved_Findings`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Apps_Failed_Logins/refresh-schedule/Security_Insights_AppFabric_Apps_Failed_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_IP_Address_Logins/refresh-schedule/Security_Insights_AppFabric_IP_Address_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Logins_By_Applications/refresh-schedule/Security_Insights_AppFabric_Logins_By_Applications`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Suspicious_Logins/refresh-schedule/Security_Insights_AppFabric_Suspicious_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Accounts_API_Failures/refresh-schedule/Security_Insights_Cloudtrail_Accounts_API_Failures`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_API_Failures/refresh-schedule/Security_Insights_Cloudtrail_API_Failures`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_API_Operations/refresh-schedule/Security_Insights_Cloudtrail_API_Operations`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Access_Key_Changes/refresh-schedule/Security_Insights_Cloudtrail_IAM_Access_Key_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Login_Details/refresh-schedule/Security_Insights_Cloudtrail_IAM_Login_Details`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_IAM_Logins/refresh-schedule/Security_Insights_Cloudtrail_IAM_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_KMS_Key_Deletions/refresh-schedule/Security_Insights_Cloudtrail_KMS_Key_Deletions`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_KMS_Key_Policy_Changes/refresh-schedule/Security_Insights_Cloudtrail_KMS_Key_Policy_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_NACL_Changes/refresh-schedule/Security_Insights_Cloudtrail_NACL_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Operation_Details/refresh-schedule/Security_Insights_Cloudtrail_Operation_Details`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Regions_API_Failures/refresh-schedule/Security_Insights_Cloudtrail_Regions_API_Failures`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Root_Login_Details/refresh-schedule/Security_Insights_Cloudtrail_Root_Login_Details`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Root_Logins/refresh-schedule/Security_Insights_Cloudtrail_Root_Logins`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Route_Table_Changes/refresh-schedule/Security_Insights_Cloudtrail_Route_Table_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Security_Group_Changes/refresh-schedule/Security_Insights_Cloudtrail_Security_Group_Changes`,
  `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_UID_API_Failures/refresh-schedule/Security_Insights_Cloudtrail_UID_API_Failures`
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
