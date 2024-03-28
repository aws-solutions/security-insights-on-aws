// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context } from 'aws-lambda';
import { logger } from '../../utils/logger';

export const getAwsAccountId = function (context: Context): string {
  logger.debug({
    label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
    message: {
      data: 'getAwsAccountId method invoked',
    },
  });
  const awsAccountId = context.invokedFunctionArn.split(':')[4];
  logger.debug({
    label: 'CreateQuickSightDataSetRefreshSchedules/Handler',
    message: {
      data: 'Returning account id',
      accountIdValue: awsAccountId,
    },
  });
  return awsAccountId;
};
