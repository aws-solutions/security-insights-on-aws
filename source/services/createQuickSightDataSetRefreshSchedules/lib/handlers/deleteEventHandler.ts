// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context } from 'aws-lambda';
import { RefreshScheduleManager } from '../resourceManagers/refreshScheduleManager';
import { logger } from '../../utils/logger';

export class DeleteEventHandler {
  constructor(
    private context: Context,
    private refreshScheduleManager: RefreshScheduleManager,
  ) {
    this.context = context;
    this.refreshScheduleManager = refreshScheduleManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'DeleteEventHandler invoked',
      },
    });
    await this.refreshScheduleManager.deleteDataSetRefreshSchedules(this.context);
  };
}
