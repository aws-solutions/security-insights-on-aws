// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { v4 as uuidv4 } from 'uuid';
import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { sendCustomResourceResponseToCloudFormation } from './utils/cfnResponse/cfnCustomResource';
import { CompletionStatus } from './utils/cfnResponse/interfaces';
import { StatusTypes } from './utils/cfnResponse/enum';

export interface IEvent {
  RequestType: string;
  ResponseURL: string;
  StackId: string;
  RequestId: string;
  ResourceType: string;
  LogicalResourceId: string;
  ResourceProperties: { [key: string]: string };
  PhysicalResourceId?: string;
}

export async function handler(event: CloudFormationCustomResourceEvent, context: Context): Promise<void> {
  const response: CompletionStatus = {
    Status: StatusTypes.SUCCESS,
    Data: {}
  };

  try {
    if (event.ResourceType === 'Custom::UUIDGenerator' && event.RequestType === 'Create') {
      response.Data = { 'UUID': getUUID() };
    }
  } catch (error) {
    response.Status = StatusTypes.FAILED;
    response.Data = error;
  } finally {
    await sendCustomResourceResponseToCloudFormation(event, context, response);
  }
}

const getUUID = () => {
  return uuidv4();
};
