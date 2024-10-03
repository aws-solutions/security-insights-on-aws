// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import { GetParameterCommand, GetParameterCommandOutput, PutParameterCommand, PutParameterCommandInput, SSMClient } from '@aws-sdk/client-ssm';

export class SSMOperations {
  constructor(private ssmClient: SSMClient) {
    this.ssmClient = ssmClient;
  }

  public getSSMParameterDetails = async (parameterName: string): Promise<GetParameterCommandOutput> => {
    logger.debug({
      label: 'UpdateSSMParameter/Handler',
      message: {
        data: 'getSSMParameterDetails method invoked',
      },
    });
    let response: GetParameterCommandOutput;
    const input = {
      Name: parameterName,
    };
    const command = new GetParameterCommand(input);
    try {
      response = await this.ssmClient.send(command);
      logger.debug({
        label: 'UpdateSSMParameter/Handler',
        message: {
          data: 'SSM parameter API response is: ',
          value: response,
        },
      });
      return response;
    } catch (error) {
      logger.error({
        label: 'UpdateSSMParameter/Handler',
        message: {
          data: 'Error while getting ssm parameter',
          value: parameterName,
          error: error,
        },
      });
      throw new Error(`Error while getting SSM parameter value for ${parameterName} with error ${error}`);
    }
  };

  public putSSMParameterConfiguration = async (getParameterResponse: GetParameterCommandOutput): Promise<void> => {
    logger.debug({
      label: 'UpdateSSMParameter/Handler',
      message: {
        data: 'putSSMParameterConfiguration method invoked',
      },
    });
    let input:PutParameterCommandInput = {
      Name: getParameterResponse.Parameter?.Name,
      Value: getParameterResponse.Parameter?.Value,
      Type: 'String',
      DataType: 'text',
      Overwrite: true
    };
    const command = new PutParameterCommand(input);
    try {
      await this.ssmClient.send(command);
    } catch (error) {
      logger.error({
        label: 'UpdateSSMParameter/Handler',
        message: {
          data: 'Error while updating ssm parameter',
          value: getParameterResponse.Parameter?.Name,
          error: error,
        },
      });
      throw new Error(`Error while updating SSM parameter value for ${getParameterResponse.Parameter?.Name} with error ${error}`);
    }
  };
  

}
