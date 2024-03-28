// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from '../../utils/logger';
import { LakeFormationsPermissionsManager } from '../resourceManagers/lakeFormationPermissionsManager';
import { isSecurityLakeAccountEqualToCurrentAccount } from '../helpers/utils';

export class EventBridgeEventHandler {
  constructor(
    private lakeFormationsPermissionsManager: LakeFormationsPermissionsManager, 
  ) {
    this.lakeFormationsPermissionsManager = lakeFormationsPermissionsManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'handleEvent invoked',
      },
    });

    if (isSecurityLakeAccountEqualToCurrentAccount()) {
      await this.lakeFormationsPermissionsManager.updateLakeFormationPermissionsForTablesInCurrentAccount();
    } else {
      await this.lakeFormationsPermissionsManager.updateLakeFormationPermissionsForTablesSharedFromSecurityLakeAccount();
      await this.lakeFormationsPermissionsManager.updateLakeFormationPermissionsForTablesInCurrentAccount();

    }
    
  };
}
