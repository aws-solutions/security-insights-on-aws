// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import {
  LakeFormationClient,
  GrantPermissionsCommand,
  GrantPermissionsCommandOutput,
  Permission,
  GetDataLakeSettingsCommand,
  GetDataLakeSettingsCommandOutput,
  PutDataLakeSettingsCommand,
  PutDataLakeSettingsCommandOutput,
  DataLakeSettings,
  ListPermissionsCommand,
  ListPermissionsCommandOutput,
  ListPermissionsCommandInput,
  PrincipalResourcePermissions,
  RevokePermissionsCommand
} from '@aws-sdk/client-lakeformation';


export class LakeFormationOperations {
  constructor(private lakeFormationClient: LakeFormationClient) {
    this.lakeFormationClient = lakeFormationClient;
  }

  public grantPermissionsToDatabase = async (
    databaseName: string,
    catalogId: string,
    principal: string,
    permissions: Permission[],
  ): Promise<GrantPermissionsCommandOutput> => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'grantPermissionsToDatabase method invoked',
      },
    });
    return await this.lakeFormationClient.send(
      new GrantPermissionsCommand({
        Principal: {
          DataLakePrincipalIdentifier: principal,
        },
        Resource: {
          Database: {
            CatalogId: catalogId,
            Name: databaseName,
          },
        },
        Permissions: permissions,
      }),
    );
  };

  public grantPermissionsToTable = async (
    datatableName: string,
    databaseName: string,
    catalogId: string,
    principal: string,
    permissions: Permission[],
  ): Promise<GrantPermissionsCommandOutput> => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'grantPermissionsToTable method invoked. Adding permissions to table',
        datatableNameValue: datatableName,
        databaseNameValue: databaseName,
        catalogIdValue: catalogId,
        principalValue: principal,
      },
    });
    return await this.lakeFormationClient.send(
      new GrantPermissionsCommand({
        Principal: {
          DataLakePrincipalIdentifier: principal,
        },
        Resource: {
          Table: {
            CatalogId: catalogId,
            DatabaseName: databaseName,
            Name: datatableName,
          },
        },
        Permissions: permissions,
      }),
    );
  };

  public getDataLakeSettings = async (accountId: string): Promise<GetDataLakeSettingsCommandOutput> => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'getDataLakeSettings method invoked',
      },
    });
    return await this.lakeFormationClient.send(
      new GetDataLakeSettingsCommand({
        CatalogId: accountId,
      }),
    );
  };

  public putDataLakeSettings = async (
    accountId: string,
    datalakeSettings: DataLakeSettings,
  ): Promise<PutDataLakeSettingsCommandOutput> => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'putDataLakeSettings method invoked',
      },
    });
    return await this.lakeFormationClient.send(
      new PutDataLakeSettingsCommand({
        CatalogId: accountId,
        DataLakeSettings: datalakeSettings,
      }),
    );
  };

  public getAllPermissionsForCatalog = async (catalogId: string) => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'getAllPermissionsForCatalog method invoked',
      },
    });
    const allPermissions: PrincipalResourcePermissions[] = [];
    let nextToken: string | undefined = undefined;
    do {
      const listPermissionsParams: ListPermissionsCommandInput = {
          CatalogId: catalogId,
          NextToken: nextToken
      };
      const listPermissionsCommand = new ListPermissionsCommand(listPermissionsParams);
      const { PrincipalResourcePermissions, NextToken }: ListPermissionsCommandOutput = await this.lakeFormationClient.send(listPermissionsCommand);
      PrincipalResourcePermissions?.map(async permission => allPermissions.push(permission))
      logger.debug({
        label: 'CreateLakeFormationPermissions/Handler',
        message: {
          data: 'PrincipalResourcePermissions',
          value: PrincipalResourcePermissions,
          nextToken: nextToken
        },
      });
      nextToken = NextToken;
    } while (nextToken);
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'List of all permissions',
        list: JSON.stringify(allPermissions)
      },
    });
    return allPermissions;
  }

  public revokePermissionsForCatalog = async (permission: PrincipalResourcePermissions) => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'getRevokePermissionsForCatalog method invoked',
      },
    });
    const revokeParams = {
      "Permissions": permission.Permissions,
      "Principal": permission.Principal,
      "Resource": permission.Resource
    }
    logger.debug({
      message: {
        revokeParams: revokeParams,
      },
    });
    try {
      const revokeCommand = new RevokePermissionsCommand(revokeParams);
      await this.lakeFormationClient.send(revokeCommand);
    }catch(error){
      logger.error({
        label: 'CreateLakeFormationPermissions/Handler',
        message: {
          data: 'getRevokePermissionsForCatalog method failed',
          error: error
        },
      });
    }
  }
}
