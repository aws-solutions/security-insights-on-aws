// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StatusTypes } from './enum';

export interface CompletionStatus {
  Status: StatusTypes;
  Data: Record<string, unknown> | { Error?: { Code: string; Message: string } };
}

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
