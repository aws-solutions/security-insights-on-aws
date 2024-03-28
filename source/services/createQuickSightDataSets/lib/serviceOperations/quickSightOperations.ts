// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import { QuickSightDataSet } from '../resourceManagers/quickSightDataSet';
import {
  QuickSightClient,
  CreateDataSetCommand,
  DeleteDataSetCommand,
  CreateDataSetCommandOutput,
  DeleteDataSetCommandOutput,
  UpdateDataSetCommandOutput,
  UpdateDataSetCommand,
  CreateDataSourceCommand,
  CreateDataSourceCommandOutput,
  DeleteDataSourceCommand,
  DeleteDataSourceCommandOutput,
} from '@aws-sdk/client-quicksight';
import { QuickSightDataSource } from '../resourceManagers/quickSightDataSource';

export class QuickSightOperations {
  constructor(private quickSightClient: QuickSightClient) {
    this.quickSightClient = quickSightClient;
  }

  public createQuickSightDataSet = async (
    quickSightDataSet: QuickSightDataSet,
  ): Promise<CreateDataSetCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'createQuickSightDataSet method invoked',
      },
    });
    try {
      return await this.quickSightClient.send(
        new CreateDataSetCommand({
          AwsAccountId: quickSightDataSet.awsAccountId,
          DataSetId: quickSightDataSet.dataSetId,
          Name: quickSightDataSet.dataSetName,
          Permissions: quickSightDataSet.permissions,
          PhysicalTableMap: quickSightDataSet.physicalTableMap,
          LogicalTableMap: quickSightDataSet.logicalTableMap,
          ImportMode: quickSightDataSet.importMode,
        }),
      );
    } catch (error) {
      logger.error({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Error while creating quicksight dataset',
          dataSetIdValue: quickSightDataSet.dataSetId,
          error: error,
        },
      });
      throw error;
    }
  };

  public deleteQuickSightDataSet = async (
    quickSightDataSet: QuickSightDataSet,
  ): Promise<DeleteDataSetCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'deleteQuickSightDataSet method invoked',
      },
    });
    try {
      return await this.quickSightClient.send(
        new DeleteDataSetCommand({
          AwsAccountId: quickSightDataSet.awsAccountId,
          DataSetId: quickSightDataSet.dataSetId,
        }),
      );
    } catch (error) {
      logger.error({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Error while creating quicksight dataset',
          dataSetIdValue: quickSightDataSet.dataSetId,
          error: error,
        },
      });
      throw error;
    }
  };

  public updateQuickSightDataSet = async (
    quickSightDataSet: QuickSightDataSet,
  ): Promise<UpdateDataSetCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'updateQuickSightDataSet method invoked',
      },
    });
    try {
      return await this.quickSightClient.send(
        new UpdateDataSetCommand({
          AwsAccountId: quickSightDataSet.awsAccountId,
          DataSetId: quickSightDataSet.dataSetId,
          Name: quickSightDataSet.dataSetName,
          PhysicalTableMap: quickSightDataSet.physicalTableMap,
          LogicalTableMap: quickSightDataSet.logicalTableMap,
          ImportMode: quickSightDataSet.importMode,
        }),
      );
    } catch (error) {
      logger.error({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Error while updating quicksight dataset',
          dataSetIdValue: quickSightDataSet.dataSetId,
          error: error,
        },
      });
      throw new Error(`Dataset update failed for the dataset ${quickSightDataSet.dataSetId} with error ${error}`);
    }
  };

  public createQuickSightDataSource = async (
    quickSightDataSource: QuickSightDataSource,
  ): Promise<CreateDataSourceCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'createQuickSightDataSource method invoked',
      },
    });
    try {
      return await this.quickSightClient.send(
        new CreateDataSourceCommand({
          AwsAccountId: quickSightDataSource.awsAccountId,
          DataSourceId: quickSightDataSource.dataSourceId,
          Name: quickSightDataSource.name,
          Permissions: quickSightDataSource.permissions,
          Type: quickSightDataSource.type,
          DataSourceParameters: quickSightDataSource.dataSourceParameters
        }),
      );
    } catch (error) {
      logger.error({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Error while creating quicksight datasource',
          dataSetIdValue: quickSightDataSource.dataSourceId,
          error: error,
        },
      });
      throw new Error(
        `Data source creation failed for the data source ${quickSightDataSource.dataSourceId} with error ${error}`,
      );
    }
  };

  public deleteQuickSightDataSource = async (
    quickSightDataSource: QuickSightDataSource,
  ): Promise<DeleteDataSourceCommandOutput> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'deleteQuickSightDataSource method invoked',
      },
    });
    try {
      return await this.quickSightClient.send(
        new DeleteDataSourceCommand({
          AwsAccountId: quickSightDataSource.awsAccountId,
          DataSourceId: quickSightDataSource.dataSourceId,
        }),
      );
    } catch (error) {
      logger.error({
        label: 'CreateQuickSightDataSets/Handler',
        message: {
          data: 'Error while updating quicksight datasource',
          dataSetIdValue: quickSightDataSource.dataSourceId,
          error: error,
        },
      });
      throw new Error(
        `Dataset deletion failed for the data source ${quickSightDataSource.dataSourceId} with error ${error}`,
      );
    }
  };
}
