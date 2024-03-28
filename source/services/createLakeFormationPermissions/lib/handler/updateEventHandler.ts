// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LakeFormationsPermissionsManager } from '../resourceManagers/lakeFormationPermissionsManager';
import { logger } from '../../utils/logger';
import { isSecurityLakeAccountEqualToCurrentAccount } from '../helpers/utils';
import { CURRENT_ACCOUNT_ID } from '../helpers/constants';

export class UpdateEventHandler {
  constructor(
    private lakeFormationPermissionsManager: LakeFormationsPermissionsManager
  ) {
    this.lakeFormationPermissionsManager = lakeFormationPermissionsManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'UpdateEventHandler invoked',
      },
    });

    await this.lakeFormationPermissionsManager.deleteDataLakeTablePermissionsForTables(CURRENT_ACCOUNT_ID)

    if (isSecurityLakeAccountEqualToCurrentAccount()) {
        await this.lakeFormationPermissionsManager.updateLakeFormationPermissionsForDatabaseInCurrentAccount()
        await this.lakeFormationPermissionsManager.updateLakeFormationPermissionsForTablesInCurrentAccount();
      } else {
        await this.lakeFormationPermissionsManager.updateLakeFormationPermissionsForResourceLinkDatabase()
        await this.lakeFormationPermissionsManager.updateLakeFormationPermissionsForTablesSharedFromSecurityLakeAccount();
        await this.lakeFormationPermissionsManager.updateLakeFormationPermissionsForTablesInCurrentAccount();
      }
  };
}
