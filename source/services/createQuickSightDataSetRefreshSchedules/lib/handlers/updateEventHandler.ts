// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceUpdateEvent, Context } from 'aws-lambda';
import { RefreshScheduleManager } from '../resourceManagers/refreshScheduleManager';
import { logger } from '../../utils/logger';

export class UpdateEventHandler {
  constructor(
    private event: CloudFormationCustomResourceUpdateEvent,
    private context: Context,
    private refreshScheduleManager: RefreshScheduleManager,
  ) {
    this.event = event;
    this.context = context;
    this.refreshScheduleManager = refreshScheduleManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'UpdateEventHandler invoked',
      },
    });

    // Check if the solution is upgraded from previous version or only cfn input has changed
    if(this.checkIfSolutionVersionUpgraded(this.event)) {
      await this.refreshScheduleManager.upgradeDataSetRefreshSchedules(this.event, this.context);
    } else {
      await this.refreshScheduleManager.updateDataSetRefreshSchedules(this.event, this.context);
    }
  };

  private checkIfSolutionVersionUpgraded = (event: CloudFormationCustomResourceUpdateEvent) => {
    return (event.ResourceProperties.Version !== event.OldResourceProperties.Version)
  }
}
