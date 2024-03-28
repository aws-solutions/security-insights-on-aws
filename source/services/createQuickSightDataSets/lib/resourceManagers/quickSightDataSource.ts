// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourcePermission, DataSourceParameters, DataSourceType } from '@aws-sdk/client-quicksight';

export class QuickSightDataSource {
  public awsAccountId: string;
  public dataSourceId: string;
  public permissions: ResourcePermission[];
  public name: string;
  public type: DataSourceType;
  public dataSourceParameters: DataSourceParameters;

  constructor(
    awsAccountId: string,
    dataSourceId: string,
    permissions: ResourcePermission[],
    name: string,
    type: DataSourceType,
    dataSourceParameters: DataSourceParameters,
  ) {
    this.awsAccountId = awsAccountId;
    this.dataSourceId = dataSourceId;
    this.permissions = permissions;
    this.name = name;
    this.type = type;
    this.dataSourceParameters = dataSourceParameters;
  }
}
