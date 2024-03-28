// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import { RefreshScheduleManager } from '../resourceManagers/refreshScheduleManager';
import { logger } from '../../utils/logger';

export class UpdateEventHandler {
  constructor(
    private event: CloudFormationCustomResourceEvent,
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
    await this.refreshScheduleManager.updateDataSetRefreshSchedules(this.event, this.context);
  };
}
