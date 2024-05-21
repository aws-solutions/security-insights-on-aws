// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import { Schedule, ScheduleFrequency } from '../helpers/interfaces';
import { RefreshScheduleOperations } from '../serviceOperations/refreshScheduleOperations';
import { listOfDataSetIds } from '../dataSets/dataSets';
import { getAwsAccountId } from '../helpers/utils';
import { DayOfWeek, Interval, RefreshType } from '../helpers/enum';
import { logger } from '../../utils/logger';
import { DELAY_IN_SECONDS_FOR_RATE_LIMITING } from '../helpers/constants';
import { createDelayInSeconds } from '../../utils/delay';

export class RefreshScheduleManager {
  constructor(private refreshScheduleOperations: RefreshScheduleOperations) {
    this.refreshScheduleOperations = refreshScheduleOperations;
  }

  public createDataSetRefreshSchedules = async (event: CloudFormationCustomResourceEvent, context: Context) => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'createDataSetRefreshSchedules method invoked',
      },
    });
    let awsAccountId = getAwsAccountId(context);
    let scheduleFrequency = this.getScheduleFrequency(event);
    let refreshType = this.getRefreshType(event);
    for (let dataSetId of listOfDataSetIds) {
      logger.debug({
        label: 'CreateLakeFormationPermissions/Handler',
        message: {
          data: 'Iterating over list of data set ids for creation',
          refreshTypeValue: refreshType,
          scheduleFrequencyValue: scheduleFrequency,
          dataSetIdValue: dataSetId,
        },
      });
      let schedule = this.getSchedule(dataSetId, scheduleFrequency, refreshType);
      await this.refreshScheduleOperations.createRefreshSchedule(dataSetId, awsAccountId, schedule);
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  };

  private getScheduleFrequency = (event: CloudFormationCustomResourceEvent): ScheduleFrequency => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'getScheduleFrequency method invoked',
      },
    });
    let scheduleFrequency: ScheduleFrequency = {
      Interval: Interval.WEEKLY,
      RefreshOnDay: {
        DayOfWeek: DayOfWeek.MONDAY, // Default to Weekly Schedule
      },
    };
    let interval: string = event.ResourceProperties.Interval; // change to read from CFN input
    switch (interval) {
      case 'Daily':
        scheduleFrequency = {
          Interval: Interval.DAILY,
        };
        break;
      case 'Weekly':
        scheduleFrequency = {
          Interval: Interval.WEEKLY,
          RefreshOnDay: {
            DayOfWeek: event.ResourceProperties.DayOfWeek, // Change this to read from CFN input
          },
        };
        break;
      case 'Monthly':
        scheduleFrequency = {
          Interval: Interval.MONTHLY,
          RefreshOnDay: {
            DayOfMonth: event.ResourceProperties.DayOfMonth, // change to read from CFN input param
          },
        };
        break;
    }
    return scheduleFrequency;
  };

  private getSchedule = (
    scheduleId: string,
    scheduleFrequency: ScheduleFrequency,
    refreshType: RefreshType,
  ): Schedule => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'getSchedule method invoked',
      },
    });
    return {
      ScheduleId: scheduleId,
      ScheduleFrequency: scheduleFrequency,
      RefreshType: refreshType,
    };
  };

  private getRefreshType = (event: CloudFormationCustomResourceEvent): RefreshType => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'getRefreshType method invoked',
      },
    });
    return event.ResourceProperties.RefreshType;
  };

  public deleteDataSetRefreshSchedules = async (context: Context) => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'deleteDataSetRefreshSchedules method invoked',
      },
    });
    let awsAccountId = getAwsAccountId(context);
    for (let dataSetId of listOfDataSetIds) {
      logger.debug({
        label: 'CreateLakeFormationPermissions/Handler',
        message: {
          data: 'Iterating over list of data set ids for deletion',
          dataSetIdValue: dataSetId,
        },
      });
      let scheduleId = dataSetId;
      await this.refreshScheduleOperations.deleteRefreshSchedule(dataSetId, awsAccountId, scheduleId);
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  };

  public updateDataSetRefreshSchedules = async (event: CloudFormationCustomResourceEvent, context: Context) => {
    logger.debug({
      label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
      message: {
        data: 'updateDataSetRefreshSchedules method invoked',
      },
    });
    let awsAccountId = getAwsAccountId(context);
    let scheduleFrequency = this.getScheduleFrequency(event);
    let refreshType = this.getRefreshType(event);
    for (let dataSetId of listOfDataSetIds) {
      logger.debug({
        label: 'CreateLakeFormationPermissions/Handler',
        message: {
          data: 'Iterating over list of data set ids for creation',
          refreshTypeValue: refreshType,
          scheduleFrequencyValue: scheduleFrequency,
          dataSetIdValue: dataSetId,
        },
      });
      let schedule = this.getSchedule(dataSetId, scheduleFrequency, refreshType);
      await this.refreshScheduleOperations.updateRefreshSchedule(dataSetId, awsAccountId, schedule);
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  };
}
