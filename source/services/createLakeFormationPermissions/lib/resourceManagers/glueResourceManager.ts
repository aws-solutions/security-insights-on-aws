// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CURRENT_ACCOUNT_ID,
  DELAY_IN_SECONDS_FOR_RATE_LIMITING,
  LIST_OF_TABLE_NAMES_FOR_DASHBOARD,
  RESOURCE_LINK_DATABASE_NAME,
  SECURITY_LAKE_ACCOUNT_ID,
  SECURITY_LAKE_DATABASE_NAME,
} from '../helpers/constants';
import { logger } from '../../utils/logger';
import { createDelayInSeconds } from '../../utils/delay';
import { GlueOperations } from '../serviceOperations/glueOperations';

export class GlueResourcesManager {
  constructor(private glueOperations: GlueOperations) {
    this.glueOperations = glueOperations;
  }

  public createResourceLinksForTables = async () => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'createResourceLinksForTables method invoked',
      },
    });
    for (let tableName of LIST_OF_TABLE_NAMES_FOR_DASHBOARD) {
      await this.glueOperations.createResourceLinkForTable(
        tableName,
        SECURITY_LAKE_DATABASE_NAME,
        SECURITY_LAKE_ACCOUNT_ID,
        RESOURCE_LINK_DATABASE_NAME,
        CURRENT_ACCOUNT_ID,
      );
      await createDelayInSeconds(Number(DELAY_IN_SECONDS_FOR_RATE_LIMITING)); // Add a delay to rate limit the API and avoid throttling.
    }
  };
}
