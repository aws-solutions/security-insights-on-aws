// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const createEventForCloudFormation = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateLakeFormationPermissions",
    "ResponseURL": "https://cloudformation-custom-resource-response-useast1.s3.amazonaws.com/",
    "StackId": "arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/",
    "RequestId": "11111111-1111-1111-1111-111111111",
    "LogicalResourceId": "QuickSightDataSetCreator",
    "ResourceType": "Custom::UUIDGenerator",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateLakeFormationPermissions",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "SecurityLakeAccount": "111111111111"
    }
}
export const responseUrl = "https://cloudformation-custom-resource-response-useast1.s3.amazonaws.com/"
export const responseBodySuccess = "{\"Status\":\"SUCCESS\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\",\"Data\":{\"UUID\":\"123456\"}}"
export const responseConfig  =  {"headers": {"Content-Length": 265, "Content-Type": ""}}

export const reponseBodyFailure = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"GrantPermissionsError\"}}}"
export const responseConfigFailure  =  {"headers": {"Content-Length": 384, "Content-Type": ""}}
export const responseConfigFailureForDeletion  =  {"headers": {"Content-Length": 368, "Content-Type": ""}}
export const responseBodyFailureForDeletion = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"Error\"}}}"
