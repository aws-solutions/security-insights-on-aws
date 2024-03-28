// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CURRENT_ACCOUNT_ID } from '../helpers/constants';
import { LakeFormationsPermissionsManager } from '../resourceManagers/lakeFormationPermissionsManager';
import { logger } from '../../utils/logger';

export class DeleteEventHandler {
  constructor(
    private lakeFormationPermissionsManager: LakeFormationsPermissionsManager,
  ) {
    this.lakeFormationPermissionsManager = lakeFormationPermissionsManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'DeleteEventHandler invoked',
      },
    });
    await this.lakeFormationPermissionsManager.deleteDataLakeTablePermissionsForTables(CURRENT_ACCOUNT_ID)
    await this.lakeFormationPermissionsManager.deleteDataLakeAdmins(CURRENT_ACCOUNT_ID);
  };
}
