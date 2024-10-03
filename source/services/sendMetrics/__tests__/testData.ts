// // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// // SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent, EventBridgeEvent } from 'aws-lambda';
import { AthenaEventDetail, OpsItemEventDetail } from '../lib/helpers/interfaces';

export const getQueryExecutionResponse = {
  $metadata: {
    httpStatusCode: 200,
    requestId: '111111111111',
    attempts: 1,
    totalRetryDelay: 0,
  },
  QueryExecution: {
    EngineVersion: {
      EffectiveEngineVersion: 'Athena engine version 3',
      SelectedEngineVersion: 'AUTO',
    },
    Query: '',
    QueryExecutionContext: {
      Catalog: 'awsdatacatalog',
      Database: 'amazon_security_lake_glue_db_us_east_2',
    },
    QueryExecutionId: '22222',
    ResultConfiguration: {
      EncryptionConfiguration: {
        EncryptionOption: 'SSE_S3',
      },
      OutputLocation: 's3://bucket-name-d9d80940/athena_results/111111111111.csv',
    },
    ResultReuseConfiguration: {
      ResultReuseByAgeConfiguration: {
        Enabled: false,
      },
    },
    StatementType: 'DML',
    Statistics: {
      DataScannedInBytes: 0,
      EngineExecutionTimeInMillis: 189,
      QueryQueueTimeInMillis: 118,
      ResultReuseInformation: {
        ReusedPreviousResult: false,
      },
      ServiceProcessingTimeInMillis: 27,
      TotalExecutionTimeInMillis: 334,
    },
    Status: {
      AthenaError: {
        ErrorCategory: 2,
        ErrorMessage:
          "COLUMN_NOT_FOUND: line 1:8: Column 'banana' cannot be resolved or requester is not authorized to access requested resources",
        ErrorType: 1006,
        Retryable: false,
      },
      CompletionDateTime: new Date('2023-10-23T19:39:04.450Z'),
      State: 'FAILED',
      StateChangeReason:
        "COLUMN_NOT_FOUND: line 1:8: Column 'banana' cannot be resolved or requester is not authorized to access requested resources",
      SubmissionDateTime: new Date('2023-10-23T19:39:04.116Z'),
    },
    SubstatementType: 'SELECT',
    WorkGroup: 'SecurityInsights-workgroup-n4qm1c7',
  },
};
export const athenaExecutionEvent = {
  'version': '0',
  'id': 'test',
  'detail-type': 'Athena Query State Change',
  'source': 'aws.athena',
  'account': '111111111111',
  'time': '2023-10-23T19:39:05Z',
  'region': 'us-east-2',
  'resources': [],
  'detail': {
    athenaError: {
      errorCategory: 2,
      errorType: 1006,
      errorMessage:
        "COLUMN_NOT_FOUND: line 1:8: Column 'banana' cannot be resolved or requester is not authorized to access requested resources",
      retryable: false,
    },
    currentState: 'FAILED',
    previousState: 'RUNNING',
    queryExecutionId: '22222',
    sequenceNumber: '3',
    statementType: 'DML',
    versionId: '0',
    workgroupName: 'SecurityInsights-workgroup-n4qm1c7',
  },
} as EventBridgeEvent<string, AthenaEventDetail>;

export const getQueryExecutionCommandInput = {"QueryExecutionId": "22222"}
export const responseUrl = "endpoint";
export const responseBodySuccess = 
{
  "TimeStamp":"2020-09-01 00:00:00.000",
  "Solution":"SolTest1234",
  "UUID":"1234",
  "SolutionVersion":"testVersion",
  "Region":"us-east-1",
  "Data":{
    "AthenaExecutionMetrics": {
      "DataScannedInBytes":"0",
      "EngineExecutionTimeInMillis":"189",
      "QueryPlanningTimeInMillis":"undefined",
      "QueryQueueTimeInMillis":"118",
      "ServiceProcessingTimeInMillis":"27",
      "TotalExecutionTimeInMillis":"334",
      "Status":"FAILED",
      "StatementType":"DML",
      "SubstatementType":"SELECT",
      "WorkGroup":"testWorkgroup"
    }
  }
}

export const responseConfig = 
{
    "headers": {
        "Content-Type": "application/json",
    },
}

export const opsItemStatusChangeEvent = {
  'version': '0',
  'id': 'test',
  'detail-type': 'OpsItem Update',
  'source': 'aws.ssm',
  'account': '111111111111',
  'time': '2023-10-23T19:39:05Z',
  'region': 'us-east-1',
  'resources': [],
  'detail': {
    title: "A new solution version is available",
    status: 'RESOLVED',
    source: 'AWS/Github'
  },
} as EventBridgeEvent<string, OpsItemEventDetail>;

export const responseBodyOpsItem = {
  "TimeStamp": "2020-09-01 00:00:00.000",
  "Solution": "SolTest1234",
  "UUID": "1234",
  "SolutionVersion": "testVersion",
  "Region": "us-east-1",
  "Data": {
    "OpsItemMetrics": {
      "Detail-Type": "OpsItem Update",
      "Status": "RESOLVED",
      "Title": "A new solution version is available"
    }
  }
}

export const opsItemResponseConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const cloudFormationCreateEvent: CloudFormationCustomResourceEvent = {
  "RequestType": "Create",
  "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
  "ResponseURL": "testURL",
  "StackId": "testId",
  "RequestId": "testId",
  "LogicalResourceId": "testId",
  "ResourceType": "Custom::CreateQuickSightDataSetRefreshSchedules",
  "ResourceProperties": {
      "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
      "AccountId": "111111111111",
      "Region": "us-east-1",
      "INPUT_PARAMETER_FREQUENCY": "Daily",
      "INPUT_PARAMETER_WEEKLY_REFRESH_DAY": "MONDAY",
      "INPUT_PARAMETER_MONTHLY_REFRESH_DAY": "1",
      "INPUT_PARAMETER_LOG_LEVEL": "INFO",
      "INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM": "10",
      "INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM": "GB",
      "INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS": "No",
      "INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS": "Yes",
      "INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION": "Yes"
  }
}

export const cloudFormationSuccessResponse = {
  "TimeStamp": "2020-09-01 00:00:00.000",
  "Solution": "SolTest1234",
  "UUID": "1234",
  "SolutionVersion": "testVersion",
  "Region": "us-east-1",
  "Data": {
    "CloudFormationInputMetrics": {
      "INPUT_PARAMETER_FREQUENCY": "Daily",
      "INPUT_PARAMETER_WEEKLY_REFRESH_DAY": "Monday",
      "INPUT_PARAMETER_MONTHLY_REFRESH_DAY": "1",
      "INPUT_PARAMETER_LOG_LEVEL": "Info",
      "INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM": "100",
      "INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM": "GB",
      "INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS": "No",
      "INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS": "Yes",
      "INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION": "Yes"
    }
  }
}

export const ssmParameterEventForSecurityHub = {
  "version": "0",
  "id": "adf53fbe-f808-f610-3d40-1cf3ec8cd060",
  "detail-type": "Parameter Store Change",
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

export const responseBodySSMParameterEvent = {
  "TimeStamp": "2020-09-01 00:00:00.000",
  "Solution": "SolTest1234",
  "UUID": "1234",
  "SolutionVersion": "testVersion",
  "Region": "us-east-1",
  "Data": {
    "SSMParameterMetrics": {
      "DataSourceName": "securityHub",
      "DataSourceStatus": "Enabled",
      "QueryWindowDuration": "7"
    }
  }
}