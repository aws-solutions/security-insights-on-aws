// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DataSourceConfiguration } from '../helpers/interfaces';
import { logger } from '../../utils/logger';
import { GetParameterCommand, GetParameterCommandOutput, SSMClient } from '@aws-sdk/client-ssm';

export class SSMOperations {
  constructor(private ssmClient: SSMClient) {
    this.ssmClient = ssmClient;
  }

  public getDataSourceConfiguration = async (parameterName: string): Promise<DataSourceConfiguration> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'getDataSourceConfiguration method invoked',
      },
    });
    let response: GetParameterCommandOutput;
    let ssmParamValue: DataSourceConfiguration;
    const input = {
      Name: parameterName,
    };
    const command = new GetParameterCommand(input);
    try {
      response = await this.ssmClient.send(command);
      logger.debug({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'SSM parameter API response is: ',
          value: response,
        },
      });
      ssmParamValue = JSON.parse(response.Parameter?.Value!);
    } catch (error) {
      logger.error({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Error while getting ssm parameter',
          value: parameterName,
          error: error,
        },
      });
      throw new Error(`Error while getting SSM parameter value for ${parameterName} with error ${error}`);
    }
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'Returning ssm parameter value as:',
        value: ssmParamValue,
      },
    });
    return ssmParamValue;
  };
}
