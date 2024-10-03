// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { sendCustomResourceResponseToCloudFormation } from '../../utils/cfnResponse/cfnCustomResource';
import { StatusTypes } from '../helpers/enum';
import {
  INPUT_PARAMETER_FREQUENCY,
  INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS,
  INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS,
  INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION,
  INPUT_PARAMETER_LOG_LEVEL,
  INPUT_PARAMETER_MONTHLY_REFRESH_DAY,
  INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM,
  INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM,
  INPUT_PARAMETER_WEEKLY_REFRESH_DAY,
} from '../helpers/constants';
import { logger } from '../../utils/logger';

import { CfnResponseData } from '../../utils/cfnResponse/interfaces';
import { MetricsManager } from '../helpers/metrics';

export class CloudFormationEventHandler {
  constructor(
    private event: CloudFormationCustomResourceEvent,
    private metricsManager: MetricsManager
  ) {
    this.event = event;
    this.metricsManager = metricsManager
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'SendMetrics/Handler',
      message: {
        data: 'SendMetricsHandler invoked',
      },
    });
    const response: CfnResponseData = {
      Status: StatusTypes.SUCCESS,
      Error: {
        Code: "",
        Message: ""
      },
    };
    try {
      let solutionInputParameters = this.getSolutionInputParameters()
      await  this.metricsManager.sendMetrics(solutionInputParameters)
    } catch (error) {
      logger.warn('Error while sending metrics')
    } finally {
      await sendCustomResourceResponseToCloudFormation(this.event, response);
    }
  };

  private getSolutionInputParameters = () => {
    return {
      "CloudFormationInputMetrics": {
        "INPUT_PARAMETER_FREQUENCY": INPUT_PARAMETER_FREQUENCY,
        "INPUT_PARAMETER_WEEKLY_REFRESH_DAY": INPUT_PARAMETER_WEEKLY_REFRESH_DAY,
        "INPUT_PARAMETER_MONTHLY_REFRESH_DAY": INPUT_PARAMETER_MONTHLY_REFRESH_DAY,
        "INPUT_PARAMETER_LOG_LEVEL": INPUT_PARAMETER_LOG_LEVEL,
        "INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM": INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM,
        "INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM": INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM,
        "INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS": INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS,
        "INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS": INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS,
        "INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION": INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION
      }
    }
  }
}
