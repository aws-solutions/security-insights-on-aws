// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourcePermission, PhysicalTable, LogicalTable, DataSetImportMode } from '@aws-sdk/client-quicksight';

export class QuickSightDataSet {
  public awsAccountId: string;
  public dataSetId: string;
  public dataSetName: string;
  public permissions: ResourcePermission[];
  public physicalTableMap: Record<string, PhysicalTable>;
  public logicalTableMap: Record<string, LogicalTable>;
  public importMode: DataSetImportMode;

  constructor(
    awsAccountId: string,
    dataSetId: string,
    dataSetName: string,
    permissions: ResourcePermission[],
    physicalTableMap: Record<string, PhysicalTable>,
    logicalTableMap: Record<string, LogicalTable>,
    importMode: DataSetImportMode,
  ) {
    this.awsAccountId = awsAccountId;
    this.dataSetId = dataSetId;
    this.dataSetName = dataSetName;
    this.permissions = permissions;
    this.physicalTableMap = physicalTableMap;
    this.logicalTableMap = logicalTableMap;
    this.importMode = importMode;
  }
}
