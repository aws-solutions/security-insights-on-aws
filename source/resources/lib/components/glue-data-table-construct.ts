// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { S3Table, TableBaseProps } from '@aws-cdk/aws-glue-alpha';
import { aws_lakeformation as lf } from 'aws-cdk-lib';

export interface GlueDataTableProps extends TableBaseProps{
  readonly s3Bucket: Bucket;
  readonly bucketPrefix: string;
  readonly listOfQuickSightPrincipals: { name: string; arn: string }[];
}

export class GlueDataTable extends Construct {
  public readonly glueTableName: string;

  constructor(scope: Construct, id: string, props: GlueDataTableProps) {
    super(scope, id);
    const glueTable = new S3Table(this, 'GlueTable', {
      description: props.description,
      database: props.database,
      tableName: props.tableName,
      bucket: props.s3Bucket,
      s3Prefix: props.bucketPrefix,
      storedAsSubDirectories: true,
      dataFormat: props.dataFormat,
      columns: props.columns,
    });

    this.glueTableName = glueTable.tableName;

    props.listOfQuickSightPrincipals.forEach((principal: { name: string; arn: string }) => {
      new lf.CfnPrincipalPermissions(this, `GluePermission${props.tableName}${principal.name}`, { //NOSONAR - This initialization is is for construct creation
        permissions: ['SELECT'],
        permissionsWithGrantOption: [],
        principal: {
          dataLakePrincipalIdentifier: principal.arn,
        },
        resource: {
          table: {
            catalogId: cdk.Aws.ACCOUNT_ID,
            databaseName: props.database.databaseName,
            name: this.glueTableName,
          },
        },
      });
    });
  }
}
