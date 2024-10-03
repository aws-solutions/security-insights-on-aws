// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context, EventBridgeEvent } from 'aws-lambda';
import { QuickSightOperations } from '../serviceOperations/quickSightOperations';
import { DataSourceConfiguration, EventDetail } from '../helpers/interfaces';
import { SSMOperations } from '../serviceOperations/ssmOperations';
import { QuickSightDataSet } from '../resourceManagers/quickSightDataSet';
import { createDataSetObjects, getAwsAccountId, getDataSourceName, getDataTableAndDatabaseNames, sendMetrics } from '../helpers/utils';
import {
  PRINCIPAL_ARN,
  DELAY_IN_SECONDS_FOR_RATE_LIMITING,
} from '../helpers/constants';
import { logger } from '../../utils/logger';
import { createDelayInSeconds } from '../../utils/delay';
export class EventBridgeEventHandler {
  constructor(
    private event: EventBridgeEvent<string, EventDetail>,
    private context: Context,
    private quickSightOperations: QuickSightOperations,
    private ssmOperations: SSMOperations,
  ) {
    this.event = event;
    this.context = context;
    this.quickSightOperations = quickSightOperations;
    this.ssmOperations = ssmOperations;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'handleEvent invoked',
      },
    });
    let dataSourceName: string = getDataSourceName(this.event.detail.name);
    let dataSourceConfiguration: DataSourceConfiguration = await this.ssmOperations.getDataSourceConfiguration(
      this.event.detail.name,
    );
    let response = getDataTableAndDatabaseNames(dataSourceName, dataSourceConfiguration.status);
    let awsAccountId = getAwsAccountId(this.context)
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'Updating datasets for:',
        dataSourceNameValue: dataSourceName,
        dataSourceStatusValue: dataSourceConfiguration.status,
        queryWindowDurationValue: dataSourceConfiguration.queryWindowDuration,
        dataTableNameValue: response.dataTableName,
        databaseName: response.databaseName,
      },
    });
    /**
     * 1. Create a list of objects usin gnew data set funtions
     * 2. UpdateDatSet method should only accpet a list and use update api
     */
    await this.updateDataSets(
      dataSourceName,
      awsAccountId,
      response.databaseName,
      response.dataTableName,
      dataSourceConfiguration.queryWindowDuration,
    );

    await sendMetrics(dataSourceConfiguration)
  };

  private updateDataSets = async (
    dataSource: string,
    awsAccountId: string,
    databaseName: string,
    dataTableName: string,
    queryWindowDuration: string,
  ): Promise<void> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'updateDataSets method invoked',
      },
    });
    const dataSetList: QuickSightDataSet[] = createDataSetObjects(
      PRINCIPAL_ARN,
      awsAccountId,
      dataSource,
      databaseName,
      dataTableName,
      queryWindowDuration,
    );
    for (const dataSet of dataSetList) {
      logger.debug({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Iterating over datasets lists',
          value: dataSet,
        },
      });
      await this.quickSightOperations.updateQuickSightDataSet(dataSet);
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  };

}
