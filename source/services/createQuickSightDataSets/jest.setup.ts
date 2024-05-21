// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

process.env.CURRENT_ACCOUNT_ID = "111111111111"
process.env.SECURITY_LAKE_ACCOUNT_ID = "111111111111"
process.env.LAMBDA_EXECUTION_ROLE_ARN = "arn:aws:iam::111111111111:role/test"
process.env.QUICKSIGHT_ADMIN_USER_GROUP_ARN = "arn:aws:quicksight:us-east-1:111111111111:group/AdminUserGroup"  
process.env.QUICKSIGHT_READ_USER_GROUP_ARN = "arn:aws:quicksight:us-east-1:111111111111:group/ReadUserGroup"
process.env.AWS_REGION = "us-east-1"
process.env.USER_AGENT_STRING = "AWSSOLUTION/test/version"
process.env.SECURITY_LAKE_VPC_TABLE_NAME = "vpcFlowLogs"
process.env.SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME = "cloudTrail"
process.env.SECURITY_LAKE_SECURITY_HUB_TABLE_NAME = "secHub"
process.env.SECURITY_LAKE_APP_FABRIC_TABLE_NAME = "appFabric"
process.env.SECURITY_LAKE_DATABASE_NAME = "securityLakeDatabase"
process.env.RESOURCE_LINK_DATABASE_NAME = "resourceLinkDatabase"
process.env.QUICKSIGHT_SERVICE_ROLE = "arn:aws:iam::111111111111:role/serviceRole"
process.env.QUICKSIGHT_ADMIN_USER = "arn:aws:quicksight:us-east-1:111111111111:user/test"
process.env.DELAY_IN_SECONDS_FOR_RATE_LIMITING = '0'
process.env.SECURITY_HUB_SSM_PARAMETER_NAME = '/solutions/securityInsights/us-east-1/securityHub'
process.env.CLOUDTRAIL_SSM_PARAMETER_NAME = '/solutions/securityInsights/us-east-1/cloudtrail'
process.env.VPC_FLOW_LOGS_SSM_PARAMETER_NAME = '/solutions/securityInsights/us-east-1/vpcFlowLogs'
process.env.APP_FABRIC_SSM_PARAMETER_NAME = '/solutions/securityInsights/us-east-1/appfabric'
