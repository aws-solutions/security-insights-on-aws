// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Permission } from "@aws-sdk/client-lakeformation"

export const createEventForSolutionDeployedInSecurityLakeAccount = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateLakeFormationPermissions",
    "ResponseURL": "https://cloudformation-custom-resource-response-useast1.s3.amazonaws.com/",
    "StackId": "arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/",
    "RequestId": "11111111-1111-1111-1111-111111111",
    "LogicalResourceId": "QuickSightDataSetCreator",
    "ResourceType": "Custom::CreateLakeFormationPermissions",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateLakeFormationPermissions",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "SecurityLakeAccount": "111111111111"
    }
}

export const deleteEventForSolutionDeployedInSecurityLakeAccount = {
    "RequestType": "Delete",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateLakeFormationPermissions",
    "ResponseURL": "https://cloudformation-custom-resource-response-useast1.s3.amazonaws.com/",
    "StackId": "arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/",
    "RequestId": "11111111-1111-1111-1111-111111111",
    "LogicalResourceId": "QuickSightDataSetCreator",
    "ResourceType": "Custom::CreateLakeFormationPermissions",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateLakeFormationPermissions",
        "AccountId": "111111111111",
        "Region": "us-east-1",
        "SecurityLakeAccount": "111111111111"
    }
}

export const  updatedDataLakeSettings = 
{
    CatalogId: "111111111111",
    DataLakeSettings: {
        "DataLakeAdmins":[
            {"DataLakePrincipalIdentifier":"arn:aws:iam::123456789012:user/lf-admin"},
            {"DataLakePrincipalIdentifier":"arn:aws:iam::111111111111:role/test"}
        ]
    }
}
export const  updatedDataLakeSettingsForDeletion = 
{
    CatalogId: "111111111111",
    DataLakeSettings: {
        "DataLakeAdmins":[
            {"DataLakePrincipalIdentifier":"arn:aws:iam::123456789012:user/lf-admin"},        ]
    }
}
export const responseUrl = "https://cloudformation-custom-resource-response-useast1.s3.amazonaws.com/"
export const responseBodySuccess = "{\"Status\":\"SUCCESS\",\"Reason\":\"\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\"}"
export const responseConfig  =  {"headers": {"Content-Length": 252, "Content-Type": ""}}

export const reponseBodyFailure = "{\"Status\":\"FAILED\",\"Reason\":\"GrantPermissionsError\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\"}"
export const responseConfigFailure  =  {"headers": {"Content-Length": 272, "Content-Type": ""}}
export const responseConfigFailureForDeletion  =  {"headers": {"Content-Length": 256, "Content-Type": ""}}
export const responseBodyFailureForDeletion = "{\"Status\":\"FAILED\",\"Reason\":\"Error\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\"}"
export const listPermissionsCommandResponse = {
    '$metadata': {
      httpStatusCode: 200,
      requestId: '2536940e-20',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    },
    PrincipalResourcePermissions: [
      {
        LastUpdated: '2023-07-19T02:43:30.769Z',
        LastUpdatedBy: 'arn:aws:iam::111111111111:role/solution',
        Permissions: [Array],
        PermissionsWithGrantOption: [Array],
        Principal: [Object],
        Resource: [Object]
      },
      {
        LastUpdated: '2023-07-19T02:43:30.769Z',
        LastUpdatedBy: 'arn:aws:iam::111111111111:role/solution',
        Permissions: [Array],
        PermissionsWithGrantOption: [Array],
        Principal: [Object],
        Resource: [Object]
      },
      {
        LastUpdated: '2023-07-19T02:43:30.769Z',
        LastUpdatedBy: 'arn:aws:iam::111111111111:user/test',
        Permissions: [Array],
        PermissionsWithGrantOption: [Array],
        Principal: [Object],
        Resource: [Object]
      },
      {
        LastUpdated: '2023-07-19T02:43:30.769Z',
        LastUpdatedBy: 'arn:aws:iam::111111111111:role/test',
        Permissions: [Array],
        PermissionsWithGrantOption: [Array],
        Principal: [Object],
        Resource: [Object]
      }
    ]
}

export const getDataLakeSettingsResponseForCreateEvent = {
  DataLakeSettings: {
      DataLakeAdmins: [
          {
              "DataLakePrincipalIdentifier": "arn:aws:iam::123456789012:user/lf-admin"
          }
      ]
  }
}

export const getDataLakeSettingsResponseForDeleteEvent = {
  DataLakeSettings: {
      DataLakeAdmins: [
          {
              "DataLakePrincipalIdentifier": "arn:aws:iam::123456789012:user/lf-admin"
          }
      ]
  }
}

export const permissionsDescribe: Permission = "DESCRIBE"
export const permissionsSelect: Permission = "SELECT"

export const grantPermissionsCommandInput = 
{
  "Permissions": [permissionsDescribe], 
  "Principal": {
    "DataLakePrincipalIdentifier": "arn:aws:iam::111111111111:role/serviceRole"
  }, 
  "Resource": {
    "Database": {
      "CatalogId": "111111111111", 
      "Name": "securityLakeDatabase"
    }
  }
}
export const grantPermissionsCommandInputSharedAccount = 
{
  "Permissions": [permissionsSelect], 
  "Principal": {
    "DataLakePrincipalIdentifier": "arn:aws:iam::111111111111:role/serviceRole"
  }, 
  "Resource": {
    "Table": {
      "CatalogId": "222222222222", 
      "DatabaseName": "securityLakeDatabase",
      "Name": "vpcFlowLogs"
    }
  }
}

export const ssmParameterUpdateEvent = {
  "version": "0",
  "id": "9547ef2d-3b7e-4057-b6cb-5fdf09ee7c8f",
  "detail-type": "Parameter Store Change",
  "source": "aws.ssm",
  "account": "111111111111",
  "time": "2017-05-22T16:44:48Z",
  "region": "us-east-1",
  "resources": [
    "arn:aws:ssm:us-east-1:111111111111:parameter/MyExampleParameter"
  ],
  "detail": {
    "operation": "Update",
    "name": "MyExampleParameter",
    "type": "String",
    "description": "Sample Parameter"
  }
}

export const updateEventForSolutionDeployedInSecurityLakeAccount = {
  "RequestType": "Update",
  "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateLakeFormationPermissions",
  "ResponseURL": "https://cloudformation-custom-resource-response-useast1.s3.amazonaws.com/",
  "StackId": "arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/",
  "RequestId": "11111111-1111-1111-1111-111111111",
  "LogicalResourceId": "QuickSightDataSetCreator",
  "ResourceType": "Custom::CreateLakeFormationPermissions",
  "ResourceProperties": {
      "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:CreateLakeFormationPermissions",
      "AccountId": "111111111111",
      "Region": "us-east-1",
      "SecurityLakeAccount": "111111111111"
  }
}
