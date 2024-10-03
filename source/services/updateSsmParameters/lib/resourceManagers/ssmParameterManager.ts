// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import { LIST_SSM_PARAMETER_NAMES } from '../helpers/constants';
import { SSMOperations } from '../serviceOperations/ssmOperations';

export class SSMParameterManager {
  constructor(private ssmOperations: SSMOperations) {
    this.ssmOperations = ssmOperations;
  }

  public incrementSSMParameterVersion = async () => { 
    // This method increments ssm parameter version by saving the same value back to the parameter.
    logger.debug({
      label: 'incrementSSMParameterVersion/Handler',
      message: {
        data: 'manageSSMParameters method invoked',
      },
    });
    for (let parameterName of LIST_SSM_PARAMETER_NAMES) {
      logger.debug(parameterName)
      let getParameterResponse = await this.ssmOperations.getSSMParameterDetails(parameterName)
      await this.ssmOperations.putSSMParameterConfiguration(getParameterResponse)
    }
  }
}
