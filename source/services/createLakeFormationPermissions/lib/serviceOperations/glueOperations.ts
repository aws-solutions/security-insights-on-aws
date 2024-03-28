// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import {
  GlueClient,
  CreateTableCommand,
  CreateTableCommandOutput
} from '@aws-sdk/client-glue';

export class GlueOperations {
  constructor(private glueClient: GlueClient) {
    this.glueClient = glueClient;
  }

  public createResourceLinkForTable = async (
    targetDatatableName: string,
    targetDatabaseName: string,
    targetCatalogId: string,
    resourceLinkDatabase: string,
    currentAccountCatalogId: string,
  ): Promise<CreateTableCommandOutput> => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'createResourceLinkForTable method invoked',
      },
    });
    return await this.glueClient.send(
      new CreateTableCommand({
        CatalogId: currentAccountCatalogId,
        DatabaseName: resourceLinkDatabase,
        TableInput: {
          Name: targetDatatableName,
          TargetTable: {
            CatalogId: targetCatalogId,
            DatabaseName: targetDatabaseName,
            Name: targetDatatableName,
          },
        },
      }),
    );
  };
}
