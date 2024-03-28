// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourcePermission } from '@aws-sdk/client-quicksight';
import { QuickSightDataSet } from '../resourceManagers/quickSightDataSet';
import { Context } from 'aws-lambda';
import * as shDataSetConfigurations from '../../dataSetConfigurations/shIndex';
import * as cloudTrailDataSetConfigurations from '../../dataSetConfigurations/cloudtrailIndex';
import * as vpcFlowLogsDataSetConfigurations from '../../dataSetConfigurations/vpcFlowLogsIndex';
import * as appFabricDataSetConfigurations from '../../dataSetConfigurations/appFabricIndex';
import { logger } from '../../utils/logger';
import { GET_DATA_SET_PERMISSIONS, GET_DATA_SOURCE_PERMISSIONS } from './permissions';
import {
  DATA_SOURCE_APP_FABRIC_NAME,
  DATA_SOURCE_CLOUDTRAIL_NAME,
  DATA_SOURCE_SECURITY_HUB_NAME,
  DATA_SOURCE_VPC_NAME,
  QUERY_WINDOW_DURATION,
  SPICE,
  TABLE_ID,
  TEST_DATABASE_NAME,
  TEST_DATATABLE_NAME,
} from './constants';

export const createDataSetObjects = function (
  principalArn: string,
  context: Context,
  dataSource: string,
  databaseName: string,
  dataTableName: string,
  queryWindowDuration: string,
): QuickSightDataSet[] {
  logger.debug({
    label: 'CreateQuickSightDataSets/Handler',
    message: {
      data: 'CloudFormationEventHandler invoked',
    },
  });
  let dataSetConfigurations: any[] = [];
  let dataSetList: QuickSightDataSet[] = [];
  let resourcePermissionsList: ResourcePermission[] = getDataSetResourcePermissions(principalArn);
  let awsAccountId = getAwsAccountId(context);
  switch (dataSource) {
    case DATA_SOURCE_SECURITY_HUB_NAME:
      dataSetConfigurations = Object.values(shDataSetConfigurations);
      break;
    case DATA_SOURCE_CLOUDTRAIL_NAME:
      dataSetConfigurations = Object.values(cloudTrailDataSetConfigurations);
      break;
    case DATA_SOURCE_VPC_NAME:
      dataSetConfigurations = Object.values(vpcFlowLogsDataSetConfigurations);
      break;
    case DATA_SOURCE_APP_FABRIC_NAME:
      dataSetConfigurations = Object.values(appFabricDataSetConfigurations);
      break;
  }
  for (let defaultDataSetConfiguration of dataSetConfigurations) {
    let dataSetConfiguration = structuredClone(defaultDataSetConfiguration);
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'Iterating on dataset configurations before replacing default values',
        dataSetIdValue: dataSetConfiguration.DataSetId,
        dataTableNameValue: dataTableName,
        sqlQueryValue: defaultDataSetConfiguration.PhysicalTableMap[TABLE_ID].CustomSql.SqlQuery,
      },
    });

    dataSetConfiguration.PhysicalTableMap[TABLE_ID].CustomSql.DataSourceArn = process.env.DATA_SOURCE_ARN!;
    dataSetConfiguration.PhysicalTableMap[TABLE_ID].CustomSql.SqlQuery = dataSetConfiguration.PhysicalTableMap[
      TABLE_ID
    ].CustomSql.SqlQuery.replaceAll(TEST_DATABASE_NAME, databaseName)
      .replaceAll(TEST_DATATABLE_NAME, dataTableName)
      .replaceAll(QUERY_WINDOW_DURATION, queryWindowDuration);

    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'Iterating on dataset configurations after replacing default values',
        dataSetIdValue: dataSetConfiguration.DataSetId,
        dataTableNameValue: dataTableName,
        sqlQueryValue: defaultDataSetConfiguration.PhysicalTableMap[TABLE_ID].CustomSql.SqlQuery,
      },
    });

    dataSetList.push(
      new QuickSightDataSet(
        awsAccountId,
        dataSetConfiguration.DataSetId,
        dataSetConfiguration.Name,
        resourcePermissionsList,
        dataSetConfiguration.PhysicalTableMap,
        dataSetConfiguration.LogicalTableMap,
        SPICE,
      ),
    );
  }
  return dataSetList;
};

export const getDataSetResourcePermissions = function (principalArn: string): ResourcePermission[] {
  logger.debug({
    label: 'CreateQuickSightDataSets/Handler',
    message: {
      data: 'CloudFormationEventHandler invoked',
    },
  });
  const permissions = [
    {
      Principal: principalArn,
      Actions: GET_DATA_SET_PERMISSIONS,
    },
  ];
  return permissions;
};

export const getDataSourceResourcePermissions = function (principalArn: string): ResourcePermission[] {
  logger.debug({
    label: 'CreateQuickSightDataSets/Handler',
    message: {
      data: 'CloudFormationEventHandler invoked',
    },
  });
  const permissions = [
    {
      Principal: principalArn,
      Actions: GET_DATA_SOURCE_PERMISSIONS,
    },
  ];
  return permissions;
};

export const getAwsAccountId = function (context: Context): string {
  logger.debug({
    label: 'CreateQuickSightDataSets/Handler',
    message: {
      data: 'CloudFormationEventHandler invoked',
    },
  });
  const awsAccountId = context.invokedFunctionArn.split(':')[4];
  return awsAccountId;
};
