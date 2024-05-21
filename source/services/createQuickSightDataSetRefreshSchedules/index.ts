// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { sendCustomResourceResponseToCloudFormation } from './utils/cfnResponse/cfnCustomResource';
import { AxiosResponse } from 'axios';
import { StatusTypes } from './lib/helpers/enum';
import { RefreshScheduleOperations } from './lib/serviceOperations/refreshScheduleOperations';
import { QuickSightClient } from '@aws-sdk/client-quicksight';
import { ServiceClientProvider } from './lib/helpers/serviceClientProvider';
import { REGION, USER_AGENT_STRING } from './lib/helpers/constants';
import { logger } from './utils/logger';
import { RefreshScheduleManager } from './lib/resourceManagers/refreshScheduleManager';
import { CreateEventHandler } from './lib/handlers/createEventHandler';
import { DeleteEventHandler } from './lib/handlers/deleteEventHandler';
import { UpdateEventHandler } from './lib/handlers/updateEventHandler';
import { CfnResponseData } from './utils/cfnResponse/interfaces';

export async function handler(
  event: CloudFormationCustomResourceEvent,
  context: Context,
): Promise<AxiosResponse | void> {
  logger.info({
    label: 'CreateRefreshSchedules/Handler',
    message: {
      Data: 'CreateRefreshSchedules handler invoked',
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

  let refreshScheduleManager = getResourceManagerObjects();

  try {
    const eventType = event.RequestType;
    switch (eventType) {
      case 'Create':
        await new CreateEventHandler(event, context, refreshScheduleManager).handleEvent();
        break;
      case 'Update':
        await new UpdateEventHandler(event, context, refreshScheduleManager).handleEvent();
        break;
      case 'Delete':
        await new DeleteEventHandler(context, refreshScheduleManager).handleEvent();
        break;
    }
  } catch (error) {
    logger.error({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        Data: 'Error occurred when executing CreateLakeFormationPermissions handler',
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

const getResourceManagerObjects = () => {
  logger.debug({
    label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
    message: {
      data: 'getResourceManagerObjects method invoked',
    },
  });
  let serviceClientProvider = new ServiceClientProvider(REGION, USER_AGENT_STRING);
  let quickSightClient: QuickSightClient = serviceClientProvider.getQuickSightClient();
  let refreshScheduleOperation: RefreshScheduleOperations = new RefreshScheduleOperations(quickSightClient);
  let refreshScheduleManager: RefreshScheduleManager = new RefreshScheduleManager(refreshScheduleOperation);
  return refreshScheduleManager;
};
