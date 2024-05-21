// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context, CloudFormationCustomResourceEvent, EventBridgeEvent } from 'aws-lambda';
import { AxiosResponse } from 'axios';
import { EventDetail } from './lib/helpers/interfaces';
import { SSMClient } from '@aws-sdk/client-ssm';
import { ServiceClientProvider } from './lib/helpers/serviceClientProvider';
import { QuickSightOperations } from './lib/serviceOperations/quickSightOperations';
import { CloudFormationEventHandler } from './lib/handlers/cloudFormationEventHandler';
import { SSMOperations } from './lib/serviceOperations/ssmOperations';
import { EventBridgeEventHandler } from './lib/handlers/eventBridgeEventHandler';
import { REGION, USER_AGENT_STRING } from './lib/helpers/constants';
import { QuickSightClient } from '@aws-sdk/client-quicksight';
import { logger } from './utils/logger';

export async function handler(
  event: CloudFormationCustomResourceEvent | EventBridgeEvent<string, EventDetail>,
  context: Context,
): Promise<AxiosResponse | void> {
  logger.info({
    label: 'CreateQuickSightDataSets/Handler',
    message: {
      data: 'CreateQuickSightDataSets handler invoked',
      event: event,
      context: context,
    },
  });
  try {
    let { ssmOperations, quickSightOperations } = getResourceManagerObjects();

    if ((event as CloudFormationCustomResourceEvent).RequestType) {
      return await new CloudFormationEventHandler(
        event as CloudFormationCustomResourceEvent,
        context,
        quickSightOperations,
        ssmOperations
      ).handleEvent();
    } else {
      return await new EventBridgeEventHandler(
        event as EventBridgeEvent<string, EventDetail>,
        context,
        quickSightOperations,
        ssmOperations,
      ).handleEvent();
    }
  } catch (error) {
    logger.error({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'Error occurred while creating datasets',
        error: error,
      },
    });
    throw error;
  }
}

export const getResourceManagerObjects = () => {
  logger.debug({
    label: 'CreateQuickSightDataSets/Handler',
    message: {
      data: 'getResourceManagerObjects method invoked',
    },
  });
  let serviceClientProvider: ServiceClientProvider = new ServiceClientProvider(REGION, USER_AGENT_STRING);
  let ssmClient: SSMClient = serviceClientProvider.getSSMClient();
  let ssmOperations: SSMOperations = new SSMOperations(ssmClient);
  let quickSightClient: QuickSightClient = serviceClientProvider.getQuickSightClient();
  let quickSightOperations: QuickSightOperations = new QuickSightOperations(quickSightClient);
  return { ssmOperations, quickSightOperations };
};
