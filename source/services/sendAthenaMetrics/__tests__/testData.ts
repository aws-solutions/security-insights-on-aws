// // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// // SPDX-License-Identifier: Apache-2.0

import { EventBridgeEvent } from 'aws-lambda';
import { EventDetail } from '../lib/interfaces';

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
} as EventBridgeEvent<string, EventDetail>;
export const testContext = {
    "invokedFunctionArn": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "awsRequestId": "testID"
}
export const getQueryExecutionCommandInput = {"QueryExecutionId": "22222"}
export const responseUrl = "endpoint"
export const responseBodySuccess = 
{
  "TimeStamp":"2023-10-23 19:39:04.450",
  "Solution":"SolTest1234",
  "UUID":"1234",
  "Data":{
    "DataScannedInBytes":"0",
    "EngineExecutionTimeInMillis":"189",
    "QueryPlanningTimeInMillis":"undefined",
    "QueryQueueTimeInMillis":"118",
    "ServiceProcessingTimeInMillis":"27",
    "TotalExecutionTimeInMillis":"334",
    "Status":"FAILED",
    "StatementType":"DML",
    "SubstatementType":"SELECT",
    "WorkGroup":"testWorkgroup",
    "Version":"testVersion",
    "Region":"us-east-1"
  }
}
export const responseConfig = 
{
    "headers": {
        "Content-Type": "application/json",
    },
}
