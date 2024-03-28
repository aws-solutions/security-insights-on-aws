// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Database } from '@aws-cdk/aws-glue-alpha';
import { aws_lakeformation as lf } from 'aws-cdk-lib';

export interface GlueDatabaseProps {
  readonly databaseName: string;
  readonly listOfQuickSightPrincipals?: { name: string; arn: string }[];
}

export class GlueDatabase extends Construct {
  public readonly glueDB: Database;

  constructor(scope: Construct, id: string, props: GlueDatabaseProps) {
    super(scope, id);

    const glueDB = new Database(this, 'GlueDB', {
      databaseName: props.databaseName,
    });

    this.glueDB = glueDB;
    if (props.listOfQuickSightPrincipals){
      props.listOfQuickSightPrincipals.forEach((principal: { name: string; arn: string }) => {
        new lf.CfnPrincipalPermissions(this, `GlueDatabasePermission${principal.name}`, { //NOSONAR - This initialization is is for construct creation
          permissions: ['DESCRIBE'],
          permissionsWithGrantOption: [],
          principal: {
            dataLakePrincipalIdentifier: principal.arn,
          },
          resource: {
            database: {
              catalogId: cdk.Aws.ACCOUNT_ID,
              name: glueDB.databaseName,
            },
          },
        });
      });
    }
    
  }
}
