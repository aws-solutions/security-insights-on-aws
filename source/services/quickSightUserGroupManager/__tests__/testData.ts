// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const createEventCloudFormation = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::QuickSightUserGroups",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "AnalysisID": "SecurityInsightsAnalysis-us-east-1",
        "DashboardID": "SecurityInsightsDashboard-us-east-1"
    }
}
export const deleteEventCloudFormation = {
    "RequestType": "Delete",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::QuickSightUserGroups",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "AnalysisID": "SecurityInsightsAnalysis-us-east-1",
        "DashboardID": "SecurityInsightsDashboard-us-east-1"
    }
}
export const adminUserGroupInput = {
    "AwsAccountId": "111111111111",
     "Description": "Admin Group", 
     "GroupName": "AdminUserGroup-us-east-1", 
     "Namespace": "default"
}

export const readUserGroupInput = {
    "AwsAccountId": "111111111111", 
    "Description": "Read Only Group", 
    "GroupName": "ReadUserGroup-us-east-1", 
    "Namespace": "default"
}
export const responseUrl = "testURL"
export const responseBodySuccess = "{\"Status\":\"SUCCESS\",\"Reason\":\"\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{}}"
export const responseConfig  =  {"headers": {"Content-Length": 141, "Content-Type": ""}}
export const reponseBodyFailure = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"DataSetError\"}}}"
export const responseConfigFailure  =  {"headers": {"Content-Length": 254, "Content-Type": ""}}
export const responseConfigFailureForDeletion  =  {"headers": {"Content-Length": 368, "Content-Type": ""}}
export const responseBodyFailureForDeletion = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"Error\"}}}"
export const testContext = {
    "invokedFunctionArn": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "awsRequestId": "testID"
}

export const UpdateDashboardPermissionsCommandInput = 
{
    "AwsAccountId": "111111111111", 
    "DashboardId": "SecurityInsightsDashboard-us-east-1", 
    "GrantPermissions": [
        {
            "Actions": [
            "quicksight:DescribeDashboard", 
            "quicksight:ListDashboardVersions", 
            "quicksight:UpdateDashboardPermissions", 
            "quicksight:QueryDashboard", 
            "quicksight:UpdateDashboard", 
            "quicksight:DeleteDashboard", 
            "quicksight:DescribeDashboardPermissions", 
            "quicksight:UpdateDashboardPublishedVersion"
            ], 
            "Principal": "arn:aws:quicksight:us-east-1:111111111111:group/default/AdminUserGroup-us-east-1"
        },
        {
            "Actions": [
                "quicksight:DescribeDashboard", 
                "quicksight:ListDashboardVersions", 
                "quicksight:QueryDashboard"
            ], 
            "Principal": "arn:aws:quicksight:us-east-1:111111111111:group/default/ReadUserGroup-us-east-1"
        }
    ]
}

export const UpdateAnalysisPermissionsCommandInput = 
{
    "AnalysisId": "SecurityInsightsAnalysis-us-east-1", 
    "AwsAccountId": "111111111111", 
    "GrantPermissions": [
        {
            "Actions": [
                "quicksight:RestoreAnalysis", 
                "quicksight:UpdateAnalysisPermissions", 
                "quicksight:DeleteAnalysis", 
                "quicksight:DescribeAnalysisPermissions", 
                "quicksight:QueryAnalysis", 
                "quicksight:DescribeAnalysis", 
                "quicksight:UpdateAnalysis"
            ], 
            "Principal": "arn:aws:quicksight:us-east-1:111111111111:group/default/AdminUserGroup-us-east-1"
        }
    ]
}

export const responseBodySuccessForDeletion = "{\"Status\":\"SUCCESS\",\"Reason\":\"\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"AdminGroupArn\":\"\",\"ReadGroupArn\":\"\"}}"
export const responseConfigForDeletion  =  {"headers": {"Content-Length": 177, "Content-Type": ""}}

export const adminUserGroupInputForDeletion = {
    "AwsAccountId": "111111111111", 
    "GroupName": "AdminUserGroup-us-east-1", 
    "Namespace": "default"
}

export const readUserGroupInputForDeletion = {
    "AwsAccountId": "111111111111", 
    "GroupName": "ReadUserGroup-us-east-1", 
    "Namespace": "default"
}

export const responseBodyForFailure = "{\"Status\":\"FAILED\",\"Reason\":\"UserGroupCreationError\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"AdminGroupArn\":\"\",\"ReadGroupArn\":\"\"}}"
export const responseConfigForFailure  =  {"headers": {"Content-Length": 198, "Content-Type": ""}}
