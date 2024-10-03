// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import { QuickSightOperations } from '../serviceOperations/quickSightOperations';
import { DataSourceAnDataTableMap } from '../helpers/interfaces';
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
  DELAY_IN_SECONDS_FOR_DATA_SOURCE_CREATION,
  DELAY_IN_SECONDS_FOR_DATA_SOURCE_UPDATE,
  INPUT_PARAMETER_FREQUENCY,
  INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS,
  INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS,
  INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION,
  INPUT_PARAMETER_LOG_LEVEL,
  INPUT_PARAMETER_MONTHLY_REFRESH_DAY,
  INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM,
  INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM,
  INPUT_PARAMETER_WEEKLY_REFRESH_DAY,
} from '../helpers/constants';
import { getAwsAccountId, getDataSourceResourcePermissions, createDataSetObjects, sendMetrics } from '../helpers/utils';
import { logger } from '../../utils/logger';
import { QuickSightDataSet } from '../resourceManagers/quickSightDataSet';
import { QuickSightDataSource } from '../resourceManagers/quickSightDataSource';
import {
  CreateDataSourceCommandOutput,
  DataSourceParameters,
  DeleteDataSourceCommandOutput,
} from '@aws-sdk/client-quicksight';
import { createDelayInSeconds } from '../../utils/delay';
import { CfnResponseData } from '../../utils/cfnResponse/interfaces';

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
    const response: CfnResponseData = {
      Status: StatusTypes.SUCCESS,
      Error: {
        Code: "",
        Message: ""
      },
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
        await this.handleUpdateEvent(response, awsAccountId, listOfDefaultSourceDataTablesNames);
        // Add a delay to let the default datasets get provisioned
        await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_DATA_SOURCE_UPDATE)); // Add a delay to rate limit the API and avoid throttling.
      }

      if (this.event.RequestType == 'Delete') {
        logger.debug({
          label: 'CreateQuickSightDataSets/handler',
          message: 'Request type is Delete',
        });
        await this.handleDeleteEvent(response, awsAccountId, listOfDefaultSourceDataTablesNames);
      }
      let solutionInputParameters = this.getSolutionInputParameters()
      await  sendMetrics(solutionInputParameters)
    } catch (error) {
      response.Status = StatusTypes.FAILED;
      response.Error = {
        Code: error.code ?? 'CustomResourceError',
        Message: error.message ?? 'Custom resource error occurred when creating QuickSight Datasets.',
      };
    } finally {
      await sendCustomResourceResponseToCloudFormation(this.event, response);
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

  private createQuickSightDataSets = async (listOfDataSets: QuickSightDataSet[]): Promise<void> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'createQuickSightDataSets method invoked',
      },
    });
    for (const dataSet of listOfDataSets) {
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

  private handleCreateEvent = async (
    response: CfnResponseData,
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
    await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_DATA_SOURCE_CREATION)); // Adding this delay for setting up datasource.
    let listOfAllDataSets: QuickSightDataSet[] = this.getListOfAllDefaultDataSets(listOfDefaultSourceDataTablesNames, awsAccountId)
    await this.createQuickSightDataSets(listOfAllDataSets)
    response.Data = { Result: 'None' };
  };

  private handleDeleteEvent = async (
    response: CfnResponseData,
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
    let listOfAllDataSets: QuickSightDataSet[] = this.getListOfAllDefaultDataSets(listOfDefaultSourceDataTablesNames, awsAccountId)
    await this.deleteDataSets(listOfAllDataSets)
    response.Data = { Result: 'None' };
  };

  private deleteDataSets = async(listOfDataSets: QuickSightDataSet[]) => {
    for (const dataSet of listOfDataSets) {
        await this.quickSightOperations.deleteQuickSightDataSet(dataSet);
        await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  }

  private getListOfAllDefaultDataSets = (listOfDefaultSourceDataTablesNames: DataSourceAnDataTableMap[], awsAccountId: string) => {
    let listOfAllDataSets: QuickSightDataSet[] = []
    for (const dataSource of listOfDefaultSourceDataTablesNames) {
      let listOfObjects = createDataSetObjects(
        PRINCIPAL_ARN,
        awsAccountId,
        dataSource.dataSourceName,
        DEFAULT_DATABASE_NAME,
        dataSource.dataTableName,
        DEFAULT_QUERY_WINDOW_DURATION,
      )
      listOfObjects.forEach(dataset => {
        listOfAllDataSets.push(dataset);
      });
    }
    return listOfAllDataSets
  }

  private handleUpdateEvent = async (
    response: CfnResponseData,
    awsAccountId: string,
    listOfDefaultSourceDataTablesNames: DataSourceAnDataTableMap[],
  ): Promise<void> => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'handleUpdateEvent method invoked',
      },
    });

    let listOfAllDataSets: QuickSightDataSet[] = this.getListOfAllDefaultDataSets(listOfDefaultSourceDataTablesNames, awsAccountId)
    for (const dataSet of listOfAllDataSets) {
      if (await this.quickSightOperations.checkIfQuickSightDataSetExists(dataSet.dataSetId, dataSet.awsAccountId)) {
          await this.quickSightOperations.updateQuickSightDataSet(dataSet)
      } else {
        await this.quickSightOperations.createQuickSightDataSet(dataSet);
      }
    }
    response.Data = { Result: 'None' };
  };  

  private getSolutionInputParameters = () => {
    return {
      "INPUT_PARAMETER_FREQUENCY": INPUT_PARAMETER_FREQUENCY,
      "INPUT_PARAMETER_WEEKLY_REFRESH_DAY": INPUT_PARAMETER_WEEKLY_REFRESH_DAY,
      "INPUT_PARAMETER_MONTHLY_REFRESH_DAY": INPUT_PARAMETER_MONTHLY_REFRESH_DAY,
      "INPUT_PARAMETER_LOG_LEVEL": INPUT_PARAMETER_LOG_LEVEL,
      "INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM": INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM,
      "INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM": INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM,
      "INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS": INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS,
      "INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS": INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS,
      "INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION": INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION
    }
  }
}
