// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserAgent } from '@aws-sdk/types';
import { SSMClient } from '@aws-sdk/client-ssm';
import { AthenaClient } from '@aws-sdk/client-athena';
import { logger } from '../../utils/logger';

export class ServiceClientProvider {
  constructor(
    private region: string,
    private customerUserAgent: UserAgent,
  ) {
    this.region = region;
    this.customerUserAgent = customerUserAgent;
  }

  public getSSMClient = (): SSMClient => {
    logger.debug({
      label: 'SendMetrics/Handler',
      message: {
        data: 'getSSMClient method invoked',
      },
    });
    const ssmClient = new SSMClient({
      region: this.region,
      customUserAgent: this.customerUserAgent,
    });
    return ssmClient;
  };

  public getAthenaClient = (): AthenaClient => {
    logger.debug({
      label: 'SendMetrics/Handler',
      message: {
        data: 'getQuickSightClient method invoked',
      },
    });
    const athenaClient = new AthenaClient({
      region: this.region,
      customUserAgent: this.customerUserAgent,
    });
    return athenaClient;
  };
}
