// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import {
  QuickSightClient,
  CreateRefreshScheduleCommand,
  DeleteRefreshScheduleCommand,
  UpdateRefreshScheduleCommand,
  UpdateRefreshScheduleCommandOutput,
  CreateRefreshScheduleCommandOutput,
  DeleteRefreshScheduleCommandOutput,
} from '@aws-sdk/client-quicksight';
import { Schedule } from '../helpers/interfaces';

export class RefreshScheduleOperations {
  constructor(private quickSightClient: QuickSightClient) {
    this.quickSightClient = quickSightClient;
  }

  public createRefreshSchedule = async (
    awsAccountId: string,
    schedule: Schedule,
  ): Promise<CreateRefreshScheduleCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'createRefreshSchedule method invoked',
      },
    });
    return await this.quickSightClient.send(
      new CreateRefreshScheduleCommand({
        DataSetId: schedule.ScheduleId, // schedule id and dataset id have the same values
        AwsAccountId: awsAccountId,
        Schedule: schedule,
      }),
    );
  };

  public updateRefreshSchedule = async (
    awsAccountId: string,
    schedule: Schedule,
  ): Promise<UpdateRefreshScheduleCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'updateRefreshSchedule method invoked',
      },
    });
    try {
      return await this.quickSightClient.send(
        new UpdateRefreshScheduleCommand({
          DataSetId: schedule.ScheduleId,  // schedule id and dataset id have the same values
          AwsAccountId: awsAccountId,
          Schedule: schedule,
        }),
      );
    } catch (error) {
      logger.error({
        label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
        message: {
          data: 'Error when updating schedule refresh settings',
          value: schedule.ScheduleId,
          error: error,
        },
      });
      throw new Error(`Dataset update failed for the dataset ${schedule.ScheduleId} with error ${error}`);
    }
  };

  public deleteRefreshSchedule = async (
    dataSetId: string,
    awsAccountId: string,
    scheduleId: string,
  ): Promise<DeleteRefreshScheduleCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'deleteRefreshSchedule method invoked',
      },
    });
    try {
      return await this.quickSightClient.send(
        new DeleteRefreshScheduleCommand({
          DataSetId: dataSetId,
          AwsAccountId: awsAccountId,
          ScheduleId: scheduleId,
        }),
      );
    } catch (error) {
      logger.error({
        label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
        message: {
          data: 'Error when updating schedule refresh settings',
          value: dataSetId,
          error: error,
        },
      });
      throw new Error(`Dataset deletion failed for the dataset ${dataSetId} with error ${error}`);
    }
  };
}
