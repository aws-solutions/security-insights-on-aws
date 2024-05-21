// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import axios, { RawAxiosRequestConfig, AxiosResponse } from 'axios';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { CfnResponseData } from './interfaces';
import { logger } from '../logger';

export async function sendCustomResourceResponseToCloudFormation(
  event: CloudFormationCustomResourceEvent,
  response: CfnResponseData,
): Promise<AxiosResponse> {
  logger.debug({
    label: 'CreateLakeFormationPermissions/Handler',
    message: {
      data: 'sendCustomResourceResponseToCloudFormation method invoked',
    },
  });
  const responseBody = JSON.stringify({
    Status: response.Status,
    Reason: response.Error?.Message,
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
