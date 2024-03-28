// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import axios, { RawAxiosRequestConfig, AxiosResponse } from 'axios';
import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { CompletionStatus } from './interfaces';
import { logger } from '../logger';

export async function sendCustomResourceResponseToCloudFormation(
  event: CloudFormationCustomResourceEvent,
  context: Context,
  response: CompletionStatus,
): Promise<AxiosResponse> {
  logger.debug({
    label: 'CreateLakeFormationPermissions/Handler',
    message: {
      data: 'sendCustomResourceResponseToCloudFormation method invoked',
    },
  });
  const responseBody = JSON.stringify({
    Status: response.Status,
    Reason: `See the details in CloudWatch Log Stream: ${context.logStreamName}`,
    PhysicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: response.Data,
  });
  const config: RawAxiosRequestConfig = {
    headers: {
      'Content-Type': '',
      'Content-Length': responseBody.length,
    },
  };
  return axios.put(event.ResponseURL, responseBody, config);
}
