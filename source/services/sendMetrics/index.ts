// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent, EventBridgeEvent } from 'aws-lambda';
import { AthenaClient } from '@aws-sdk/client-athena';
import { logger } from './utils/logger';
import { MetricsManager } from './lib/helpers/metrics';
import { AWS_REGION, METRICS_ENDPOINT, SEND_METRIC, USER_AGENT_STRING } from './lib/helpers/constants';
import { ServiceClientProvider } from './lib/helpers/serviceClientProvider';
import { CloudFormationEventHandler } from './lib/handlers/cloudFormationEventHandler';
import { EventBridgeEventHandler } from './lib/handlers/eventBridgeEventHandler';
import { AxiosResponse } from 'axios';
import { AthenaOperations } from './lib/serviceOperations/athenaOperations';
import { SSMClient } from '@aws-sdk/client-ssm';
import { SSMOperations } from './lib/serviceOperations/ssmOperations';
import { AthenaEventDetail, SSMParameterEventDetail, OpsItemEventDetail } from './lib/helpers/interfaces';


export async function handler(
  event: CloudFormationCustomResourceEvent | EventBridgeEvent<string, AthenaEventDetail | OpsItemEventDetail | SSMParameterEventDetail>,
): Promise<AxiosResponse | void> {
  logger.debug({
    label: 'SendMetrics/Handler',
    message: {
      data: 'SendMetrics handler invoked',
      event: event,
    },
  });
  try {
    if(isMetricsEnabled()) {
      let { ssmOperations, athenaOperations, metricsManager } = getResourceManagerObjects();
      if ((event as CloudFormationCustomResourceEvent).RequestType) {
        return await new CloudFormationEventHandler(
          event as CloudFormationCustomResourceEvent,
          metricsManager
        ).handleEvent();
      } else {
        return await new EventBridgeEventHandler(
          event as EventBridgeEvent<string, AthenaEventDetail | OpsItemEventDetail | SSMParameterEventDetail>,
          athenaOperations,
          ssmOperations,
          metricsManager
        ).handleEvent();
      }
    }
  } catch (error) {
    logger.warn({
      label: 'SendMetrics/Handler',
      message: {
        data: 'Error occurred while sending metrics',
        error: error,
      },
    });
  }
}

const getResourceManagerObjects = () => {
  logger.debug({
    label: 'SendMetrics/Handler',
    message: {
      data: 'getResourceManagerObjects method invoked',
    },
  });
  let serviceClientProvider: ServiceClientProvider = new ServiceClientProvider(AWS_REGION, USER_AGENT_STRING);
  let ssmClient: SSMClient = serviceClientProvider.getSSMClient();
  let ssmOperations: SSMOperations = new SSMOperations(ssmClient);
  let athenaClient: AthenaClient = serviceClientProvider.getAthenaClient();
  let athenaOperations: AthenaOperations = new AthenaOperations(athenaClient);
  let metricsManager: MetricsManager = new MetricsManager(METRICS_ENDPOINT);
  return { ssmOperations, athenaOperations, metricsManager };
};

const isMetricsEnabled = () => {
  return SEND_METRIC === 'True';
}


