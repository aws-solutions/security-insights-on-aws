// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0


export interface SolutionMetric {
    TimeStamp: string | undefined;
    Solution: string;
    UUID: string;
    Data: { [key: string]: string };
  }
  
  export enum StatusTypes {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }
  
  export interface CompletionStatus {
    Status: StatusTypes;
    Data: Record<string, unknown> | { Error?: { Code: string; Message: string } };
  }
  
  export interface AthenaError {
    errorCategory: string | number;
    errorType: string | number;
    errorMessage: string;
    retryable: boolean;
  }
  
  export interface EventDetail {
    athenaError?: AthenaError;
    versionId: string;
    currentState: string;
    previousState: string;
    statementType: string;
    queryExecutionId: string;
    workgroupName: string;
    sequenceNumber: string;
    name?: string;
    type?: string;
    operation?: string;
  }