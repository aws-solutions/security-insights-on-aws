// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserAgent } from '@aws-sdk/types';
import { LakeFormationClient } from '@aws-sdk/client-lakeformation';
import { GlueClient } from '@aws-sdk/client-glue';
import { logger } from '../../utils/logger';

export class ServiceClientProvider {
  constructor(
    private region: string,
    private customerUserAgent: UserAgent,
  ) {
    this.region = region;
    this.customerUserAgent = customerUserAgent;
  }

  public getGlueClient = (): GlueClient => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'getGlueClient method invoked',
      },
    });
    const glueClient = new GlueClient({
      region: this.region,
      customUserAgent: this.customerUserAgent,
    });
    return glueClient;
  };

  public getLakeFormationClient = (): LakeFormationClient => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'getLakeFormationClient method invoked',
      },
    });
    const lakeFormationClient = new LakeFormationClient({
      region: this.region,
      customUserAgent: this.customerUserAgent,
    });
    return lakeFormationClient;
  };
}
