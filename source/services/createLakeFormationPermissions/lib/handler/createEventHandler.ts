// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LakeFormationsPermissionsManager } from '../resourceManagers/lakeFormationPermissionsManager';
import { GlueResourcesManager } from '../resourceManagers/glueResourceManager';
import { logger } from '../../utils/logger';
import { isSecurityLakeAccountEqualToCurrentAccount } from '../helpers/utils';

export class CreateEventHandler {
  constructor(
    private lakeFormationPermissionsManager: LakeFormationsPermissionsManager,
    private glueResourcesManager: GlueResourcesManager,
  ) {
    this.lakeFormationPermissionsManager = lakeFormationPermissionsManager;
    this.glueResourcesManager = glueResourcesManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'CreateEventHandler invoked',
      },
    });
    if (isSecurityLakeAccountEqualToCurrentAccount()) {
      await this.lakeFormationPermissionsManager.setupLakeFormationPermissionsForTablesInCurrentAccount();
    } else {
      await this.glueResourcesManager.createResourceLinksForTables();
      await this.lakeFormationPermissionsManager.setupLakeFormationPermissionsForTablesSharedFromSecurityLakeAccount();
    }
  };
}
