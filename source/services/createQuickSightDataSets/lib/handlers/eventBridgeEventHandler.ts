// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context, EventBridgeEvent } from 'aws-lambda';
import { QuickSightOperations } from '../serviceOperations/quickSightOperations';
import { DataSourceConfiguration, DatabaseDetail, EventDetail } from '../helpers/interfaces';
import { SSMOperations } from '../serviceOperations/ssmOperations';
import { QuickSightDataSet } from '../resourceManagers/quickSightDataSet';
import { createDataSetObjects } from '../helpers/utils';
import {
  PRINCIPAL_ARN,
  SECURITY_LAKE_DATABASE_NAME,
  SECURITY_LAKE_VPC_TABLE_NAME,
  DEFAULT_DATABASE_NAME,
  DEFAULT_VPC_TABLE_NAME,
  SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME,
  DEFAULT_CLOUDTRAIL_TABLE_NAME,
  SECURITY_LAKE_SECURITY_HUB_TABLE_NAME,
  DEFAULT_SECURITY_HUB_TABLE_NAME,
  RESOURCE_LINK_DATABASE_NAME,
  CURRENT_ACCOUNT_ID,
  SECURITY_LAKE_ACCOUNT_ID,
  SECURITY_LAKE_APP_FABRIC_TABLE_NAME,
  DELAY_IN_SECONDS_FOR_RATE_LIMITING,
  DEFAULT_APP_FABRIC_DATATABLE_NAME,
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
    let dataSourceName: string = this.getDataSourceName(this.event.detail.name);
    let dataSourceConfiguration: DataSourceConfiguration = await this.ssmOperations.getDataSourceConfiguration(
      this.event.detail.name,
    );
    let response = this.getDataTableAndDatabaseNames(dataSourceName, dataSourceConfiguration.status);
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
    await this.updateDataSets(
      dataSourceName,
      this.context,
      response.databaseName,
      response.dataTableName,
      dataSourceConfiguration.queryWindowDuration,
    );
  };

  private updateDataSets = async (
    dataSource: string,
    context: Context,
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
      context,
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

  private getDataSourceName = (eventName: string): string => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'getDataSourceName method invoked',
      },
    });
    let dataSourceName = eventName.split('/')[4];
    return dataSourceName;
  };

  private getDataTableAndDatabaseNames = (dataSource: string, sourceStatus: string): DatabaseDetail => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'getDataTableAndDatabaseNames method invoked',
      },
    });
    let dataBaseName = '';
    let dataTableName = '';
    let sourceValue: string = dataSource + sourceStatus;
    switch (sourceValue) {
      case 'vpcFlowLogsEnabled': {
        dataBaseName = this.getDatabaseNameForCurrentAccount();
        dataTableName = SECURITY_LAKE_VPC_TABLE_NAME;
        break;
      }
      case 'vpcFlowLogsDisabled': {
        dataBaseName = DEFAULT_DATABASE_NAME;
        dataTableName = DEFAULT_VPC_TABLE_NAME;
        break;
      }
      case 'cloudtrailEnabled': {
        dataBaseName = this.getDatabaseNameForCurrentAccount();
        dataTableName = SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME;
        break;
      }
      case 'cloudtrailDisabled': {
        dataBaseName = DEFAULT_DATABASE_NAME;
        dataTableName = DEFAULT_CLOUDTRAIL_TABLE_NAME;
        break;
      }
      case 'securityHubEnabled': {
        dataBaseName = this.getDatabaseNameForCurrentAccount();
        dataTableName = SECURITY_LAKE_SECURITY_HUB_TABLE_NAME;
        break;
      }
      case 'securityHubDisabled': {
        dataBaseName = DEFAULT_DATABASE_NAME;
        dataTableName = DEFAULT_SECURITY_HUB_TABLE_NAME;
        break;
      }
      case 'appfabricEnabled': {
        dataBaseName = this.getDatabaseNameForCurrentAccount();
        dataTableName = SECURITY_LAKE_APP_FABRIC_TABLE_NAME;
        break;
      }
      case 'appfabricDisabled': {
        dataBaseName = DEFAULT_DATABASE_NAME;
        dataTableName = DEFAULT_APP_FABRIC_DATATABLE_NAME;
        break;
      }
    }
    return {
      databaseName: dataBaseName,
      dataTableName: dataTableName,
    };
  };

  private getDatabaseNameForCurrentAccount = () => {
    if (SECURITY_LAKE_ACCOUNT_ID === CURRENT_ACCOUNT_ID) {
      return SECURITY_LAKE_DATABASE_NAME;
    } else {
      return RESOURCE_LINK_DATABASE_NAME;
    }
  };
}
