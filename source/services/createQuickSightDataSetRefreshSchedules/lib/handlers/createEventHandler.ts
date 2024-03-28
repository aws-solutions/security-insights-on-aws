// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceCreateEvent, Context } from 'aws-lambda';
import { RefreshScheduleManager } from '../resourceManagers/refreshScheduleManager';
import { logger } from '../../utils/logger';

export class CreateEventHandler {
  constructor(
    private event: CloudFormationCustomResourceCreateEvent,
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
        data: 'CreateEventHandler invoked',
      },
    });
    await this.refreshScheduleManager.createDataSetRefreshSchedules(this.event, this.context);
  };
}
