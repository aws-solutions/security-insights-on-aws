// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import { QuickSightOperations } from '../serviceOperations/quickSightOperations';
import { CompletionStatus, DataSourceAnDataTableMap } from '../helpers/interfaces';
import { sendCustomResourceResponseToCloudFormation } from '../../utils/cfnResponse/cfnCustomResource';
import { StatusTypes } from '../helpers/enum';
import {
  DATA_SOURCE_VPC_NAME,
  DEFAULT_VPC_TABLE_NAME,
  DATA_SOURCE_CLOUDTRAIL_NAME,
  DEFAULT_CLOUDTRAIL_TABLE_NAME,
  DATA_SOURCE_SECURITY_HUB_NAME,
  DEFAULT_SECURITY_HUB_TABLE_NAME,
  PRINCIPAL_ARN,
  DEFAULT_DATABASE_NAME,
  DEFAULT_QUERY_WINDOW_DURATION,
  ATHENA_WORKGROUP_NAME,
  DATA_SOURCE_APP_FABRIC_NAME,
  DEFAULT_APP_FABRIC_DATATABLE_NAME,
  DELAY_IN_SECONDS_FOR_RATE_LIMITING,
} from '../helpers/constants';
import { getAwsAccountId, createDataSetObjects, getDataSourceResourcePermissions } from '../helpers/utils';
import { logger } from '../../utils/logger';
import { QuickSightDataSet } from '../resourceManagers/quickSightDataSet';
import { QuickSightDataSource } from '../resourceManagers/quickSightDataSource';
import {
  CreateDataSourceCommandOutput,
  DataSourceParameters,
  DeleteDataSourceCommandOutput,
} from '@aws-sdk/client-quicksight';
import { createDelayInSeconds } from '../../utils/delay';

export class CloudFormationEventHandler {
  constructor(
    private event: CloudFormationCustomResourceEvent,
    private context: Context,
    private quickSightOperations: QuickSightOperations,
  ) {
    this.event = event;
    this.context = context;
    this.quickSightOperations = quickSightOperations;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'CloudFormationEventHandler invoked',
      },
    });
    const response: CompletionStatus = {
      Status: StatusTypes.SUCCESS,
      Data: {},
    };

    const listOfDefaultSourceDataTablesNames: DataSourceAnDataTableMap[] = [
      { dataSourceName: DATA_SOURCE_VPC_NAME, dataTableName: DEFAULT_VPC_TABLE_NAME },
      { dataSourceName: DATA_SOURCE_CLOUDTRAIL_NAME, dataTableName: DEFAULT_CLOUDTRAIL_TABLE_NAME },
      { dataSourceName: DATA_SOURCE_SECURITY_HUB_NAME, dataTableName: DEFAULT_SECURITY_HUB_TABLE_NAME },
      { dataSourceName: DATA_SOURCE_APP_FABRIC_NAME, dataTableName: DEFAULT_APP_FABRIC_DATATABLE_NAME },
    ];
    try {
      const awsAccountId = getAwsAccountId(this.context);
      if (this.event.RequestType == 'Create') {
        logger.debug({
          label: 'CreateQuickSightDataSets/handler',
          message: 'Request type is Create',
        });
        await this.handleCreateEvent(response, awsAccountId, listOfDefaultSourceDataTablesNames);
      }

      if (this.event.RequestType == 'Update') {
        logger.debug({
          label: 'CreateQuickSightDataSets/handler',
          message: 'Request type is Update',
        });
        response.Data = { Result: 'None' };
      }

      if (this.event.RequestType == 'Delete') {
        logger.debug({
          label: 'CreateQuickSightDataSets/handler',
          message: 'Request type is Delete',
        });
        await this.handleDeleteEvent(response, awsAccountId, listOfDefaultSourceDataTablesNames);
      }
    } catch (error) {
      response.Status = StatusTypes.FAILED;
      response.Data.Error = {
        Code: error.code ?? 'CustomResourceError',
        Message: error.message ?? 'Custom resource error occurred when creating QuickSight Datasets.',
      };
    } finally {
      await sendCustomResourceResponseToCloudFormation(this.event, this.context, response);
    }
  };

  private createDataSource = async (awsAccountId: string): Promise<CreateDataSourceCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'createDataSource method invoked',
      },
    });
    const quickSightResourcePermissions = getDataSourceResourcePermissions(PRINCIPAL_ARN);
    const athenaParameters: DataSourceParameters = {
      AthenaParameters: {
        WorkGroup: ATHENA_WORKGROUP_NAME,
      },
    };
    const dataSource: QuickSightDataSource = new QuickSightDataSource(
      awsAccountId,
      'AthenaDataSourceSecurityInsights',
      quickSightResourcePermissions,
      'AthenaDataSourceSecurityInsights',
      'ATHENA',
      athenaParameters,
    );
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'Creating data source for:',
        value: dataSource,
      },
    });
    return await this.quickSightOperations.createQuickSightDataSource(dataSource);
  };

  private deleteDataSource = async (awsAccountId: string): Promise<DeleteDataSourceCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'deleteDataSource method invoked',
      },
    });
    const quickSightResourcePermissions = getDataSourceResourcePermissions(PRINCIPAL_ARN);
    const athenaParameters: DataSourceParameters = {
      AthenaParameters: {
        WorkGroup: ATHENA_WORKGROUP_NAME,
      },
    };
    const dataSource: QuickSightDataSource = new QuickSightDataSource(
      awsAccountId,
      'AthenaDataSourceSecurityInsights',
      quickSightResourcePermissions,
      'AthenaDataSourceSecurityInsights',
      'ATHENA',
      athenaParameters,
    );
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'Deleting data source for:',
        value: dataSource,
      },
    });
    return this.quickSightOperations.deleteQuickSightDataSource(dataSource);
  };

  private createDataSets = async (dataSetList: QuickSightDataSet[]): Promise<void> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'createDataSets method invoked',
      },
    });
    for (const dataSet of dataSetList) {
      logger.debug({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Iterating over list of datasets for creation',
          value: dataSet,
        },
      });
      await this.quickSightOperations.createQuickSightDataSet(dataSet);
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  };

  private deleteDataSets = async (dataSetList: QuickSightDataSet[]): Promise<void> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'deleteDataSets method invoked',
      },
    });
    for (const dataSet of dataSetList) {
      logger.debug({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Iterating over list of datasets for deletion',
          value: dataSet,
        },
      });
      await this.quickSightOperations.deleteQuickSightDataSet(dataSet);
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  };

  private handleCreateEvent = async (
    response: CompletionStatus,
    awsAccountId: string,
    listOfDefaultSourceDataTablesNames: DataSourceAnDataTableMap[],
  ): Promise<void> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'handleCreateEvent method invoked',
      },
    });
    await this.createDataSource(awsAccountId);

    for (const dataSource of listOfDefaultSourceDataTablesNames) {
      const dataSetList: QuickSightDataSet[] = createDataSetObjects(
        PRINCIPAL_ARN,
        this.context,
        dataSource.dataSourceName,
        DEFAULT_DATABASE_NAME,
        dataSource.dataTableName,
        DEFAULT_QUERY_WINDOW_DURATION,
      );
      await this.createDataSets(dataSetList);
      response.Data = { Result: 'None' };
    }
  };

  private handleDeleteEvent = async (
    response: CompletionStatus,
    awsAccountId: string,
    listOfDefaultSourceDataTablesNames: DataSourceAnDataTableMap[],
  ): Promise<void> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'handleDeleteEvent method invoked',
      },
    });
    await this.deleteDataSource(awsAccountId);
    for (const dataSource of listOfDefaultSourceDataTablesNames) {
      const dataSetList: QuickSightDataSet[] = createDataSetObjects(
        PRINCIPAL_ARN,
        this.context,
        dataSource.dataSourceName,
        DEFAULT_DATABASE_NAME,
        dataSource.dataTableName,
        DEFAULT_QUERY_WINDOW_DURATION,
      );
      await this.deleteDataSets(dataSetList);
      response.Data = { Result: 'None' };
    }
  };
}
