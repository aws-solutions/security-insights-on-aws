// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CREATE_USER_GROUPS,
  CURRENT_ACCOUNT_ID,
  DELAY_IN_SECONDS_FOR_RATE_LIMITING,
  LAMBDA_EXECUTION_ROLE_ARN,
  LIST_OF_PRINCIPALS_WITH_USER_GROUPS,
  LIST_OF_PRINCIPAL_WITHOUT_USER_GROUPS,
  LIST_OF_RESOURCE_LINKS,
  LIST_OF_TABLE_NAMES_FOR_DASHBOARD,
  RESOURCE_LINK_DATABASE_NAME,
  SECURITY_LAKE_ACCOUNT_ID,
  SECURITY_LAKE_DATABASE_NAME,
} from '../helpers/constants';
import { LakeFormationOperations } from '../serviceOperations/lakeFormationOperations';
import {
  Permission,
  GetDataLakeSettingsCommandOutput,
  DataLakeSettings,
  DataLakePrincipal,
  PrincipalResourcePermissions,
} from '@aws-sdk/client-lakeformation';
import {
  PERMISSION_FOR_RESOURCE_LINK_DATABASE,
  PERMISSION_FOR_RESOURCE_LINK_DATATABLES,
  PERMISSION_FOR_SECURITY_LAKE_TABLES,
} from '../helpers/permissions';
import { logger } from '../../utils/logger';
import { createDelayInSeconds } from '../../utils/delay';

export class LakeFormationsPermissionsManager {
  constructor(private lakeFormationOperations: LakeFormationOperations) {
    this.lakeFormationOperations = lakeFormationOperations;
  }

  public setupLakeFormationPermissionsForTablesSharedFromSecurityLakeAccount = async () => {
    let LIST_OF_PRINCIPALS_FOR_DATA_LAKE = this.getListOfPrincipals()
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'setupLakeFormationPermissionsForTablesSharedFromSecurityLakeAccount method invoked',
      },
    });
    await this.setupDataLakeAdmins(CURRENT_ACCOUNT_ID);
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'Adding permissions for Resource Link Database',
      },
    });
    await this.addLakeFormationPermissionForDatabase(
      RESOURCE_LINK_DATABASE_NAME,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      CURRENT_ACCOUNT_ID,
      PERMISSION_FOR_RESOURCE_LINK_DATABASE,
    );
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'Adding permissions for Resource Link Table',
      },
    });

    await this.addLakeFormationPermissionForTables(
      RESOURCE_LINK_DATABASE_NAME,
      LIST_OF_RESOURCE_LINKS,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      CURRENT_ACCOUNT_ID,
      PERMISSION_FOR_RESOURCE_LINK_DATATABLES,
    );

    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'Adding permissions for Security Link Source Tables',
      },
    });
    
    await this.addLakeFormationPermissionForTables(
      SECURITY_LAKE_DATABASE_NAME,
      LIST_OF_TABLE_NAMES_FOR_DASHBOARD,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      SECURITY_LAKE_ACCOUNT_ID,
      PERMISSION_FOR_SECURITY_LAKE_TABLES,
    );
  };

  public setupLakeFormationPermissionsForTablesInCurrentAccount = async () => {
    let LIST_OF_PRINCIPALS_FOR_DATA_LAKE = this.getListOfPrincipals()
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'setupLakeFormationPermissionsForTablesInCurrentAccount method invoked',
      },
    });
    await this.setupDataLakeAdmins(CURRENT_ACCOUNT_ID);
    await this.addLakeFormationPermissionForDatabase(
      SECURITY_LAKE_DATABASE_NAME,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      CURRENT_ACCOUNT_ID,
      PERMISSION_FOR_RESOURCE_LINK_DATABASE,
    );
    await this.addLakeFormationPermissionForTables(
      SECURITY_LAKE_DATABASE_NAME,
      LIST_OF_TABLE_NAMES_FOR_DASHBOARD,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      SECURITY_LAKE_ACCOUNT_ID,
      PERMISSION_FOR_SECURITY_LAKE_TABLES,
    );
  };

  private setupDataLakeAdmins = async (currentAccountId: string) => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'setupDataLakeAdmins method invoked',
      },
    });
    let dataLakeSettingsResponse: GetDataLakeSettingsCommandOutput =
      await this.lakeFormationOperations.getDataLakeSettings(currentAccountId);
    let updatedDataLakeSettings: DataLakeSettings = this.getUpdatedLakeFormationSettings(dataLakeSettingsResponse);
    await this.lakeFormationOperations.putDataLakeSettings(currentAccountId, updatedDataLakeSettings);
  };

  public deleteDataLakeAdmins = async (currentAccountId: string) => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'deleteDataLakeAdmins method invoked',
      },
    });
    let dataLakeSettingsResponse: GetDataLakeSettingsCommandOutput =
      await this.lakeFormationOperations.getDataLakeSettings(currentAccountId);
    let updatedDataLakeSettings: DataLakeSettings = this.removeLambdaArnFromAdminList(dataLakeSettingsResponse);
    await this.lakeFormationOperations.putDataLakeSettings(currentAccountId, updatedDataLakeSettings);
  };

  private removeLambdaArnFromAdminList = (datalakeSettingsResponse: GetDataLakeSettingsCommandOutput) => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'removeLambdaArnFromAdminList method invoked',
      },
    });
    let updatedDataLakeSettings: DataLakeSettings = datalakeSettingsResponse.DataLakeSettings!;
    let listOfCurrentAdmins: DataLakePrincipal[] = updatedDataLakeSettings?.DataLakeAdmins!;
    listOfCurrentAdmins.forEach((item, index) => {
      logger.debug({
        label: 'CreateLakeFormationPermissions/Handler',
        message: {
          data: 'Iterating over list of principals',
          Value: item.DataLakePrincipalIdentifier,
        },
      });
      if (item.DataLakePrincipalIdentifier === LAMBDA_EXECUTION_ROLE_ARN) {
        listOfCurrentAdmins.splice(index, 1);
      }
    });
    return updatedDataLakeSettings;
  };

  private getUpdatedLakeFormationSettings = (
    datalakeSettingsResponse: GetDataLakeSettingsCommandOutput,
  ): DataLakeSettings => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'getUpdatedLakeFormationSettings method invoked',
      },
    });
    let updatedDataLakeSettings: DataLakeSettings = datalakeSettingsResponse.DataLakeSettings!;
    let listOfCurrentAdmins: DataLakePrincipal[] = updatedDataLakeSettings?.DataLakeAdmins!;
    listOfCurrentAdmins.push({
      DataLakePrincipalIdentifier: LAMBDA_EXECUTION_ROLE_ARN,
    });
    return updatedDataLakeSettings;
  };

  private addLakeFormationPermissionForDatabase = async (
    databaseName: string,
    listOfQuickSightPrincipals: string[],
    catalogId: string,
    permissions: Permission[],
  ) => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'addLakeFormationPermissionForDatabase method invoked',
      },
    });
    for (let principal of listOfQuickSightPrincipals) {
      logger.debug({
        label: 'CreateLakeFormationPermissions/Handler',
        message: {
          data: 'Iterating over list of principals',
          value: principal,
          databaseName:databaseName,
          catalogId: catalogId
        },
      });
      await this.lakeFormationOperations.grantPermissionsToDatabase(databaseName, catalogId, principal, permissions);
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  };

  private addLakeFormationPermissionForTables = async (
    databaseName: string,
    listOfTableNames: string[],
    listOfQuickSightPrincipals: string[],
    catalogId: string,
    permissions: Permission[],
  ) => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'addLakeFormationPermissionForTables method invoked',
      },
    });
    for (let principal of listOfQuickSightPrincipals) {
      for (let table of listOfTableNames) {
        try {
          logger.debug({
            label: 'CreateLakeFormationPermissions/Handler',
            message: {
              data: 'Iterating over list of principals',
              principalValue: principal,
              tableValue: table,
              databaseName: databaseName
            },
          });
          await this.lakeFormationOperations.grantPermissionsToTable(
            table,
            databaseName,
            catalogId,
            principal,
            permissions,
          );
          await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
        } catch (error) {
          logger.error({
            label: 'CreateLakeFormationPermissions/Handler',
            message: {
              data: 'Error when adding principal to the table',
              principalValue: principal,
              tableValue: table,
              error: error
            },
          });
        }
      }
    }
  };

  public updateLakeFormationPermissionsForTablesSharedFromSecurityLakeAccount = async () => {
    let LIST_OF_PRINCIPALS_FOR_DATA_LAKE = this.getListOfPrincipals()
    await this.addLakeFormationPermissionForTables(
      RESOURCE_LINK_DATABASE_NAME,
      LIST_OF_RESOURCE_LINKS,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      CURRENT_ACCOUNT_ID,
      PERMISSION_FOR_RESOURCE_LINK_DATATABLES,
    );
  }

  public updateLakeFormationPermissionsForTablesInCurrentAccount = async () => {
    let LIST_OF_PRINCIPALS_FOR_DATA_LAKE = this.getListOfPrincipals()
    await this.addLakeFormationPermissionForTables(
      SECURITY_LAKE_DATABASE_NAME,
      LIST_OF_TABLE_NAMES_FOR_DASHBOARD,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      SECURITY_LAKE_ACCOUNT_ID,
      PERMISSION_FOR_SECURITY_LAKE_TABLES,
    );
  }

  public deleteDataLakeTablePermissionsForTables = async (catalogId: string) => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'deleteDataLakeTablePermissionsForTables method invoked',
      },
    });
    const listOfAllPermissionsForCatalog: PrincipalResourcePermissions[] = await this.lakeFormationOperations.getAllPermissionsForCatalog(catalogId)
    const filteredListOfPermissions: PrincipalResourcePermissions[] = this.filterPermissionsCreatedBySolution(listOfAllPermissionsForCatalog)
    for(let permission of filteredListOfPermissions) {
      await this.lakeFormationOperations.revokePermissionsForCatalog(permission)
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)) // Add a delay to rate limit the API and avoid throttling.
    }
  };

  private filterPermissionsCreatedBySolution = (listOfPermissions: PrincipalResourcePermissions[]) => {
    let filteredListofPermissions = listOfPermissions.filter((permission) => 
      permission.LastUpdatedBy === LAMBDA_EXECUTION_ROLE_ARN
    )
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'List of all permissions',
        list: JSON.stringify(filteredListofPermissions)
      },
    });
    return filteredListofPermissions
  }

  public updateLakeFormationPermissionsForDatabaseInCurrentAccount = async () => {
    let LIST_OF_PRINCIPALS_FOR_DATA_LAKE = this.getListOfPrincipals()
    await this.addLakeFormationPermissionForDatabase(
      SECURITY_LAKE_DATABASE_NAME,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      CURRENT_ACCOUNT_ID,
      PERMISSION_FOR_RESOURCE_LINK_DATABASE,
    );
  }

  public updateLakeFormationPermissionsForResourceLinkDatabase = async () => {
    let LIST_OF_PRINCIPALS_FOR_DATA_LAKE = this.getListOfPrincipals()
    await this.addLakeFormationPermissionForDatabase(
      RESOURCE_LINK_DATABASE_NAME,
      LIST_OF_PRINCIPALS_FOR_DATA_LAKE,
      CURRENT_ACCOUNT_ID,
      PERMISSION_FOR_RESOURCE_LINK_DATABASE,
    );
  }

  private getListOfPrincipals = () => {
    let listOfPrincipals = (CREATE_USER_GROUPS === 'Yes') ? LIST_OF_PRINCIPALS_WITH_USER_GROUPS: LIST_OF_PRINCIPAL_WITHOUT_USER_GROUPS
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'List of all principals',
        list: JSON.stringify(listOfPrincipals)
      },
    });
    return listOfPrincipals
  }
}
