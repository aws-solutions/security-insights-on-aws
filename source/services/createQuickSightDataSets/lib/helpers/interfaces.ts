// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0



export interface EventDetail {
  name: string;
  type: string;
  operation: string;
}

export interface DatabaseDetail {
  databaseName: string;
  dataTableName: string;
}

export interface DataSourceAnDataTableMap {
  dataSourceName: string;
  dataTableName: string;
}

export interface DataSourceConfiguration {
  status: string;
  queryWindowDuration: string;
}

export interface DataSetConfiguration {
  principalArn: string;
  dataSourceName: string;
  databaseName: string;
  dataTableName: string;
  queryWindowDuration: string
}
export interface SolutionMetric {
  Solution: string;
  UUID: string;
  Data: { [key: string]: string };
}
