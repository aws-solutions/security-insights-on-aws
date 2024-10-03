// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceUpdateEvent } from 'aws-lambda';
import { logger } from '../../utils/logger';
import { SSMParameterManager } from '../resourceManagers/ssmParameterManager';

export class UpdateEventHandler {
  constructor(
    private event: CloudFormationCustomResourceUpdateEvent,
    private ssmParameterManager: SSMParameterManager
  ) {
    this.event = event;
    this.ssmParameterManager = ssmParameterManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'UpdateSSMParameter/Handler',
      message: {
        data: 'UpdateEventHandler invoked',
      },
    });    
   
    if(this.checkIfSolutionVersionUpgraded(this.event)) {    // Check if the solution is upgraded from previous version
      await this.ssmParameterManager.incrementSSMParameterVersion();
    }
  };

  private checkIfSolutionVersionUpgraded = (event: CloudFormationCustomResourceUpdateEvent) => {
    logger.debug(`solution version upgrade is : ${ (event.ResourceProperties.Version !== event.OldResourceProperties.Version)}`)
    return (event.ResourceProperties.Version !== event.OldResourceProperties.Version)
  }
}
