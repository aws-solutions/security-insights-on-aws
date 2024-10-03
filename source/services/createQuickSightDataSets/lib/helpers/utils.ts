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
  CURRENT_ACCOUNT_ID,
  DATA_SOURCE_APP_FABRIC_NAME,
  DATA_SOURCE_CLOUDTRAIL_NAME,
  DATA_SOURCE_SECURITY_HUB_NAME,
  DATA_SOURCE_VPC_NAME,
  DEFAULT_APP_FABRIC_DATATABLE_NAME,
  DEFAULT_CLOUDTRAIL_TABLE_NAME,
  DEFAULT_DATABASE_NAME,
  DEFAULT_SECURITY_HUB_TABLE_NAME,
  DEFAULT_VPC_TABLE_NAME,
  METRICS_ENDPOINT,
  QUERY_WINDOW_DURATION,
  RESOURCE_LINK_DATABASE_NAME,
  SECURITY_LAKE_ACCOUNT_ID,
  SECURITY_LAKE_APP_FABRIC_TABLE_NAME,
  SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME,
  SECURITY_LAKE_DATABASE_NAME,
  SECURITY_LAKE_SECURITY_HUB_TABLE_NAME,
  SECURITY_LAKE_VPC_TABLE_NAME,
  SEND_METRIC,
  SPICE,
  TABLE_ID,
  TEST_DATABASE_NAME,
  TEST_DATATABLE_NAME,
} from './constants';
import { DatabaseDetail, SolutionMetric } from './interfaces';
import { Metrics } from './metrics';

export const createDataSetObjects = function (
  principalArn: string,
  awsAccountId: string,
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

export const getDataSourceName = (eventName: string): string => {
  logger.debug({
    label: 'CreateQuickSightDataSets/Handler',
    message: {
      data: 'getDataSourceName method invoked',
    },
  });
  let dataSourceName = eventName.split('/')[4];
  return dataSourceName;
};

export const getDataTableAndDatabaseNames = (dataSource: string, sourceStatus: string): DatabaseDetail => {
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
      dataBaseName = getDatabaseNameForCurrentAccount();
      dataTableName = SECURITY_LAKE_VPC_TABLE_NAME;
      break;
    }
    case 'vpcFlowLogsDisabled': {
      dataBaseName = DEFAULT_DATABASE_NAME;
      dataTableName = DEFAULT_VPC_TABLE_NAME;
      break;
    }
    case 'cloudtrailEnabled': {
      dataBaseName = getDatabaseNameForCurrentAccount();
      dataTableName = SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME;
      break;
    }
    case 'cloudtrailDisabled': {
      dataBaseName = DEFAULT_DATABASE_NAME;
      dataTableName = DEFAULT_CLOUDTRAIL_TABLE_NAME;
      break;
    }
    case 'securityHubEnabled': {
      dataBaseName = getDatabaseNameForCurrentAccount();
      dataTableName = SECURITY_LAKE_SECURITY_HUB_TABLE_NAME;
      break;
    }
    case 'securityHubDisabled': {
      dataBaseName = DEFAULT_DATABASE_NAME;
      dataTableName = DEFAULT_SECURITY_HUB_TABLE_NAME;
      break;
    }
    case 'appfabricEnabled': {
      dataBaseName = getDatabaseNameForCurrentAccount();
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

export const getDatabaseNameForCurrentAccount = () => {
  if (SECURITY_LAKE_ACCOUNT_ID === CURRENT_ACCOUNT_ID) {
    return SECURITY_LAKE_DATABASE_NAME;
  } else {
    return RESOURCE_LINK_DATABASE_NAME;
  }
};

export const sendMetrics = async (metricsData:any) => {
  if (metricsEnabled()) {
    let metricsObj: SolutionMetric = createMetricsResposeObject(metricsData);
    await Metrics.sendAnonymizedMetric(METRICS_ENDPOINT, metricsObj);
  }
}

const metricsEnabled = () => {
  return SEND_METRIC === 'True';
}

const createMetricsResposeObject = (metricsData: any) => {

  return {
    Solution: <string>process.env.SOLUTION_ID,
    UUID: <string>process.env.UUID,
    Data: metricsData,
  };
}