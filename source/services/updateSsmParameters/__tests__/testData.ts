// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const testContext = {
    "invokedFunctionArn": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "awsRequestId": "testID"
}
export const createEventCloudFormation = {
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
        "Region": "us-east-1"
    }
}

export const deleteEventCloudFormation = {
    "RequestType": "Delete",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",  
    "ResourceType": "Custom::CreateQuickSightDataSets",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1"
    }
}

export const updateEventCloudFormationSameVersion = {
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
        "Version": "2.0.0"
    },
    "OldResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "Version": "2.0.0"
    }
}

export const updateEventCloudFormationNewVersion = {
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
        "Version": "2.0.2"
    },
    "OldResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateQuickSightDataSets",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "Version": "2.0.0"
    }
}

export const responseUrl = "testURL"
export const responseBodySuccess = "{\"Status\":\"SUCCESS\",\"Reason\":\"\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\"}"
export const responseConfig  =  {"headers": {"Content-Length": 131, "Content-Type": ""}}

export const getParameterCommandResponse = {
    "$metadata": {
        "httpStatusCode": 200,
        "requestId": "testid",
        "attempts": 1,
        "totalRetryDelay": 0
    },
    "Parameter": {
        "ARN": "arn:aws:ssm:us-east-1:111111111111:parameter/solutions/securityInsights/us-east-1/securityHub",
        "DataType": "text",
        "LastModifiedDate": "2018-02-13T12:48:32.975Z",
        "Name": "/solutions/securityInsights/us-east-1/securityHub",
        "Type": "String",
        "Value": '{"status":"Enabled","queryWindowDuration":"7"}',
        "Version": 2
    }
}

export const getParameterCommandResponseSecurityHub = {
    "$metadata": {
        "httpStatusCode": 200,
        "requestId": "testid",
        "attempts": 1,
        "totalRetryDelay": 0
    },
    "Parameter": {
        "ARN": "arn:aws:ssm:us-east-1:111111111111:parameter/solutions/securityInsights/us-east-1/securityHub",
        "DataType": "text",
        "LastModifiedDate": "2018-02-13T12:48:32.975Z",
        "Name": "/solutions/securityInsights/us-east-1/securityHub",
        "Type": "String",
        "Value": '{"status":"Enabled","queryWindowDuration":"7"}',
        "Version": 2
    }
}

export const getParameterCommandResponseCloudTrail = {
    "$metadata": {
        "httpStatusCode": 200,
        "requestId": "testid",
        "attempts": 1,
        "totalRetryDelay": 0
    },
    "Parameter": {
        "ARN": "arn:aws:ssm:us-east-1:111111111111:parameter/solutions/securityInsights/us-east-1/cloudtrail",
        "DataType": "text",
        "LastModifiedDate": "2018-02-13T12:48:32.975Z",
        "Name": "/solutions/securityInsights/us-east-1/cloudtrail",
        "Type": "String",
        "Value": '{"status":"Enabled","queryWindowDuration":"7"}',
        "Version": 2
    }
}

export const getParameterCommandResponseVpcFlowLogs = {
    "$metadata": {
        "httpStatusCode": 200,
        "requestId": "testid",
        "attempts": 1,
        "totalRetryDelay": 0
    },
    "Parameter": {
        "ARN": "arn:aws:ssm:us-east-1:111111111111:parameter/solutions/securityInsights/us-east-1/VpcFlowLogs",
        "DataType": "text",
        "LastModifiedDate": "2018-02-13T12:48:32.975Z",
        "Name": "/solutions/securityInsights/us-east-1/VpcFlowLogs",
        "Type": "String",
        "Value": '{"status":"Disabled","queryWindowDuration":"7"}',
        "Version": 2
    }
}

export const getParameterCommandResponseAppFabric = {
    "$metadata": {
        "httpStatusCode": 200,
        "requestId": "testid",
        "attempts": 1,
        "totalRetryDelay": 0
    },
    "Parameter": {
        "ARN": "arn:aws:ssm:us-east-1:111111111111:parameter/solutions/securityInsights/us-east-1/AppFabric",
        "DataType": "text",
        "LastModifiedDate": "2018-02-13T12:48:32.975Z",
        "Name": "/solutions/securityInsights/us-east-1/AppFabric",
        "Type": "String",
        "Value": '{"status":"Disabled","queryWindowDuration":"7"}',
        "Version": 2
    }
}

export const PutParameterInputForSecurityHub = {
    "DataType": "text", 
    "Name": "/solutions/securityInsights/us-east-1/securityHub", 
    "Overwrite": true, 
    "Type": "String", 
    "Value": "{\"status\":\"Enabled\",\"queryWindowDuration\":\"7\"}"
}
export const PutParameterInputForCloudtrail = {
    "DataType": "text", 
    "Name": "/solutions/securityInsights/us-east-1/cloudtrail", 
    "Overwrite": true, 
    "Type": "String", 
    "Value": "{\"status\":\"Enabled\",\"queryWindowDuration\":\"7\"}"
}
export const PutParameterInputForVpcFlowLogs = {
    "DataType": "text", 
    "Name": "/solutions/securityInsights/us-east-1/VpcFlowLogs", 
    "Overwrite": true, 
    "Type": "String", 
    "Value": "{\"status\":\"Disabled\",\"queryWindowDuration\":\"7\"}"
}
export const PutParameterInputForAppFabric = {
    "DataType": "text", 
    "Name": "/solutions/securityInsights/us-east-1/AppFabric", 
    "Overwrite": true, 
    "Type": "String", 
    "Value": "{\"status\":\"Disabled\",\"queryWindowDuration\":\"7\"}"
}