// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserAgent } from '@aws-sdk/types';
import { SSMClient } from '@aws-sdk/client-ssm';
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
      label: 'UpdateSSMParameter/Handler',
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
}
