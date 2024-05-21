// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { v4 as uuidv4 } from 'uuid';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { sendCustomResourceResponseToCloudFormation } from './utils/cfnResponse/cfnCustomResource';
import { CfnResponseData } from './utils/cfnResponse/interfaces';
import { StatusTypes } from './utils/cfnResponse/enum';
import { logger } from './utils/logger';

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

export async function handler(event: CloudFormationCustomResourceEvent): Promise<void> {
  const response: CfnResponseData = {
    Status: StatusTypes.SUCCESS,
    Data: {
      Code: '',
      Message: ''
    }
  };

  try {
    if (event.ResourceType === 'Custom::UUIDGenerator' && event.RequestType === 'Create') {
      response.Data = { 'UUID': getUUID() };
    }
  } catch (error) {
    response.Status = StatusTypes.FAILED;
    response.Data = {
      Code: error.code ?? 'CustomResourceError',
      Message: error.message ?? 'Error occurred when executing CreateLakeFormationPermissions handler',
    };
    logger.error({
      label: 'UUIDGenerator/Handler',
      message: {
        data: 'Error occurred while generating uuid',
        error: error,
      },
    });
  } finally {
    await sendCustomResourceResponseToCloudFormation(event, response);
  }
}

const getUUID = () => {
  return uuidv4();
};
