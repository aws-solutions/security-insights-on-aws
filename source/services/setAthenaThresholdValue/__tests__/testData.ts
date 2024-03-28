// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const createEventCloudFormationThresholdUnitInGB = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::CreateQuickSightDataSets",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "ThresholdUnit": "GB",
        "ThresholdValue": "100"
    }
}

export const createEventCloudFormationThresholdUnitInMB = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::CreateQuickSightDataSets",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "ThresholdUnit": "MB",
        "ThresholdValue": "100"
    }
}

export const createEventCloudFormationThresholdUnitInTB = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::CreateQuickSightDataSets",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "ThresholdUnit": "TB",
        "ThresholdValue": "1"
    }
}

export const createEventCloudFormationThresholdUnitInPB = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::CreateQuickSightDataSets",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "ThresholdUnit": "PB",
        "ThresholdValue": "1"
    }
}

export const createEventCloudFormationThresholdUnitInEB = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::CreateQuickSightDataSets",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "ThresholdUnit": "EB",
        "ThresholdValue": "1"
    }
}

export const updateEventCloudFormationThresholdUnitInGB = {
    "RequestType": "Update",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::CreateQuickSightDataSets",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "ThresholdUnit": "GB",
        "ThresholdValue": "100"
    }
}


export const responseUrl = "testURL"

export const responseBodySuccessForUnitInMB = "{\"Status\":\"SUCCESS\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"ThresholdValueInBytes\":104857600}}"
export const responseConfigForUnitInMB =  {"headers": {"Content-Length": 225, "Content-Type": ""}}

export const responseBodySuccessForUnitInGB = "{\"Status\":\"SUCCESS\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"ThresholdValueInBytes\":107374182400}}"
export const responseConfigForUnitInGB =  {"headers": {"Content-Length": 228, "Content-Type": ""}}

export const responseBodySuccessForUnitInTB = "{\"Status\":\"SUCCESS\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"ThresholdValueInBytes\":1099511627776}}"
export const responseConfigForUnitInTB =  {"headers": {"Content-Length": 229, "Content-Type": ""}}

export const responseBodySuccessForUnitInPB = "{\"Status\":\"SUCCESS\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"ThresholdValueInBytes\":1125899906842624}}"
export const responseConfigForUnitInPB =  {"headers": {"Content-Length": 232, "Content-Type": ""}}

export const responseBodySuccessForUnitInEB = "{\"Status\":\"SUCCESS\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"ThresholdValueInBytes\":1152921504606847000}}"
export const responseConfigForUnitInEB =  {"headers": {"Content-Length": 235, "Content-Type": ""}}

export const reponseBodyFailure = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"DataSetError\"}}}"
export const responseConfigFailure  =  {"headers": {"Content-Length": 254, "Content-Type": ""}}
export const responseConfigFailureForDeletion  =  {"headers": {"Content-Length": 368, "Content-Type": ""}}
export const responseBodyFailureForDeletion = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"Error\"}}}"
export const testContext = {
    "invokedFunctionArn": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "awsRequestId": "testID"
}

