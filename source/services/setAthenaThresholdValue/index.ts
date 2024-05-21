// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { logger } from './utils/logger';
import { sendCustomResourceResponseToCloudFormation } from './utils/cfnResponse/cfnCustomResource';
import { AxiosResponse } from 'axios';
import { CfnResponseData } from './utils/cfnResponse/interfaces';
import { StatusTypes } from './lib/helpers/enum';

export async function handler(
  event: CloudFormationCustomResourceEvent,
  context: Context,
): Promise<AxiosResponse | void> {
  logger.info({
    label: 'SetAthenaThresholdValue/Handler',
    message: {
      data: 'SetAthenaThresholdValue handler invoked',
      event: event,
      context: context,
    },
  });
  const response: CfnResponseData = {
    Status: StatusTypes.SUCCESS,
    Data: {
      ThresholdValueInBytes: '',
    },
    Error: {
      Code: '',
      Message: ''
    }
  };

  try {
    const eventType = event.RequestType;
    switch (eventType) {
      case 'Create':
      case 'Update':
        response.Data = {
          ThresholdValueInBytes: Number(convertThresholdToBytes(event)),
        };
    }
  } catch (error) {
    logger.error({
      label: 'SetAthenaThresholdValue/Handler',
      message: {
        data: 'Error occurred when executing SetAthenaThresholdValue handler',
        event: event,
        context: context,
        result: 'Error',
        error: error,
      },
    });
    response.Status = StatusTypes.FAILED;
    response.Error = {
      Code: error.code ?? 'CustomResourceError',
      Message: error.message ?? 'Error occurred when executing setThresholdValue for Athena',
    };
    logger.error({
      label: 'SetAthenaThresholdValue/Handler',
      message: {
        data: 'Error occurred while creating threshold value',
        error: error,
      },
    });
  } finally {
    await sendCustomResourceResponseToCloudFormation(event, response);
  }
}

function convertThresholdToBytes(event: CloudFormationCustomResourceEvent): number {
  let thresholdValue: number = event.ResourceProperties.ThresholdValue;
  let thresholdUnit: string = event.ResourceProperties.ThresholdUnit;
  const unitValueMap = new Map<string, number>();
  unitValueMap.set('MB', 1024 ** 2);
  unitValueMap.set('GB', 1024 ** 3);
  unitValueMap.set('TB', 1024 ** 4);
  unitValueMap.set('PB', 1024 ** 5);
  unitValueMap.set('EB', 1024 ** 6);

  return thresholdValue * unitValueMap.get(thresholdUnit)!;
}
