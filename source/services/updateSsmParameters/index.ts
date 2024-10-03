// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { sendCustomResourceResponseToCloudFormation } from './utils/cfnResponse/cfnCustomResource';
import { AxiosResponse } from 'axios';
import { StatusTypes } from './lib/helpers/enum';
import { ServiceClientProvider } from './lib/helpers/serviceClientProvider';
import { REGION, USER_AGENT_STRING } from './lib/helpers/constants';
import { logger } from './utils/logger';
import { UpdateEventHandler } from './lib/handlers/updateEventHandler';
import { CfnResponseData } from './utils/cfnResponse/interfaces';
import { SSMClient } from '@aws-sdk/client-ssm';
import { SSMOperations } from './lib/serviceOperations/ssmOperations';
import { SSMParameterManager } from './lib/resourceManagers/ssmParameterManager';

export async function handler(
  event: CloudFormationCustomResourceEvent,
  context: Context,
): Promise<AxiosResponse | void> {
  logger.info({
    label: 'UpdateSSMParameter/Handler',
    message: {
      Data: 'UpdateSSMParameter handler invoked',
      Event: event,
      context: context,
    },
  });
  const response: CfnResponseData = {
    Status: StatusTypes.SUCCESS,
    Error: {
      Code: "",
      Message: ""
    },
  };

  let ssmParameterManager = getSSMManagerObjects();
  const eventType = event.RequestType;
  try {
    if (eventType === 'Update') {
        await new UpdateEventHandler(event, ssmParameterManager).handleEvent();
    }
  } catch (error) {
    logger.error({
      label: 'UpdateSSMParameter/Handler',
      message: {
        Data: 'Error occurred when executing Update SSM Parameter handler',
        Event: event,
        Context: context,
        Result: 'Error',
        Error: error,
      },
    });
    response.Status = StatusTypes.FAILED;
    response.Error = {
      Code: error.code ?? 'CustomResourceError',
      Message: error.message ?? 'Error occurred when executing CreateLakeFormationPermissions handler',
    };
  } finally {
    await sendCustomResourceResponseToCloudFormation(event, response);
  }
}

const getSSMManagerObjects = () => {
  logger.debug({
    label: 'UpdateSSMParameter/Handler',
    message: {
      data: 'getSSMManagerObjects method invoked',
    },
  });
  let serviceClientProvider = new ServiceClientProvider(REGION, USER_AGENT_STRING);
  let ssmClient: SSMClient = serviceClientProvider.getSSMClient();
  let ssmOperations: SSMOperations = new SSMOperations(ssmClient);
  let ssmParameterManager: SSMParameterManager = new SSMParameterManager(ssmOperations);
  return ssmParameterManager;
};
