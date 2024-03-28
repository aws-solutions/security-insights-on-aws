// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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

export const ssmParameterEventForSecurityHub = {
    "version": "0",
    "id": "adf53fbe-f808-f610-3d40-1cf3ec8cd060",
    "detail-type": "Scheduled Event",
    "source": "aws.events",
    "account": "111111111111",
    "time": "2024-01-17T13:06:37Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:events:us-east-1:111111111111:rule/testinputchange-EventsRuleLambdaEventsRule0A996B52-1exYl98wivU0"
    ],
    "detail": {
        "name": "/solutions/securityInsights/us-east-1/securityHub",
        "description": "SSM parameter to toggle the data source securityHub in the Security Lake",
        "type": "String",
        "operation": "Update"
    }
};

export const getParameterCommandResponseForSecurityHub = {
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

export const ssmParameterEventForVpcFlowLogs = {
    "version": "0",
    "id": "adf53fbe-f808-f610-3d40-1cf3ec8cd060",
    "detail-type": "Scheduled Event",
    "source": "aws.events",
    "account": "111111111111",
    "time": "2024-01-17T13:06:37Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:events:us-east-1:111111111111:rule/testinputchange-EventsRuleLambdaEventsRule0A996B52-1exYl98wivU0"
    ],
    "detail": {
        "name": "/solutions/securityInsights/us-east-1/vpcFlowLogs",
        "description": "SSM parameter to toggle the data source vpc flow logs in the Security Lake",
        "type": "String",
        "operation": "Update"
    }
};
export const getParameterCommandResponseForVpcFlowLogs = {
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
        "Name": "/solutions/securityInsights/us-east-1/vpcFlowLogs",
        "Type": "String",
        "Value": '{"status":"Enabled","queryWindowDuration":"7"}',
        "Version": 2
    }
}

export const ssmParameterEventForCloudtrail = {
    "version": "0",
    "id": "adf53fbe-f808-f610-3d40-1cf3ec8cd060",
    "detail-type": "Scheduled Event",
    "source": "aws.events",
    "account": "111111111111",
    "time": "2024-01-17T13:06:37Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:events:us-east-1:111111111111:rule/testinputchange-EventsRuleLambdaEventsRule0A996B52-1exYl98wivU0"
    ],
    "detail": {
        "name": "/solutions/securityInsights/us-east-1/cloudtrail",
        "description": "SSM parameter to toggle the data source cloudtrail in the Security Lake",
        "type": "String",
        "operation": "Update"
    }
};

export const getParameterCommandResponseForCloudtrail = {
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
        "Name": "/solutions/securityInsights/us-east-1/cloudtrail",
        "Type": "String",
        "Value": '{"status":"Enabled","queryWindowDuration":"7"}',
        "Version": 2
    }
}
export const ssmParameterEventForAppFabric = {
    "version": "0",
    "id": "adf53fbe-f808-f610-3d40-1cf3ec8cd060",
    "detail-type": "Scheduled Event",
    "source": "aws.events",
    "account": "111111111111",
    "time": "2024-01-17T13:06:37Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:events:us-east-1:111111111111:rule/testinputchange-EventsRuleLambdaEventsRule0A996B52-1exYl98wivU0"
    ],
    "detail": {
        "name": "/solutions/securityInsights/us-east-1/appfabric",
        "description": "SSM parameter to toggle the data source AppFabric in the Security Lake",
        "type": "String",
        "operation": "Update"
    }
};
export const getParameterCommandResponseForAppFabric = {
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
        "Name": "/solutions/securityInsights/us-east-1/appfabric",
        "Type": "String",
        "Value": '{"status":"Enabled","queryWindowDuration":"7"}',
        "Version": 2
    }
}


export const responseUrl = "testURL"
export const responseBodySuccess = "{\"Status\":\"SUCCESS\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"Result\":\"None\"}}"
export const responseConfig  =  {"headers": {"Content-Length": 207, "Content-Type": ""}}
export const reponseBodyFailure = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"DataSetError\"}}}"
export const responseConfigFailure  =  {"headers": {"Content-Length": 254, "Content-Type": ""}}
export const responseConfigFailureForDeletion  =  {"headers": {"Content-Length": 368, "Content-Type": ""}}
export const responseBodyFailureForDeletion = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"Error\"}}}"
export const testContext = {
    "invokedFunctionArn": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "awsRequestId": "testID"
}
export const datasourceCreationFailureResponseBody = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"Data source creation failed for the data source AthenaDataSourceSecurityInsights with error Error: DataSetError\"}}}"

export const datasourceCreatioConfigFailure  =  {"headers": {"Content-Length": 353, "Content-Type": ""}}


export const createDataSetCommandInput = {
    "AwsAccountId": "111111111111", 
    "DataSetId": "User_Logins_By_SaaS_Apps", 
    "ImportMode": "SPICE", 
    "LogicalTableMap": {
        "9670312f-78f1-4948-a259-1ca12c40120c": {
            "Alias": "User_Logins_By_SaaS_Apps", 
            "DataTransforms": [{
                "ProjectOperation": {
                    "ProjectedColumns": ["Count", "Vendor", "status"]
                }
            }], 
            "Source": {
                "PhysicalTableId": "60ace416-784e-4798-8766-58bf09b9faaf"
            }}}, 
            "Name": "User_Logins_By_SaaS_Apps", 
            "Permissions": [{
                "Actions": [
                    "quicksight:DescribeDataSet", 
                    "quicksight:DescribeDataSetPermissions", 
                    "quicksight:PassDataSet", 
                    "quicksight:DescribeIngestion", 
                    "quicksight:ListIngestions", 
                    "quicksight:UpdateDataSet", 
                    "quicksight:DeleteDataSet", 
                    "quicksight:CreateIngestion", 
                    "quicksight:CancelIngestion", 
                    "quicksight:UpdateDataSetPermissions"
                ], 
                "Principal": ""
            }], 
            "PhysicalTableMap": {
                "60ace416-784e-4798-8766-58bf09b9faaf": {
                    "CustomSql": {
                        "Columns": [
                            {"Name": "Count", "Type": "INTEGER"}, 
                            {"Name": "Vendor", "Type": "STRING"}, 
                            {"Name": "status", "Type": "STRING"}
                        ], "DataSourceArn": undefined, 
                        "Name": "User_Logins_By_SaaS_Apps", 
                        "SqlQuery": "SELECT COUNT(*) as \"Count\", metadata.product.vendor_name AS \"Vendor\", status FROM \"undefined\".\"undefined\"WHERE eventDay BETWEEN cast(date_format(current_timestamp - INTERVAL 'undefined' day, '%Y%m%d%H') as varchar) and cast(date_format(current_timestamp - INTERVAL '0' day, '%Y%m%d%H') as varchar)AND status in ('Failure', 'Success')GROUP BY status, metadata.product.vendor_name"
                    }
                }
            }
        }

