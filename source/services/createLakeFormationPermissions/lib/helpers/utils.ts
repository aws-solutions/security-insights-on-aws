// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { logger } from "../../utils/logger";
import { CURRENT_ACCOUNT_ID, SECURITY_LAKE_ACCOUNT_ID } from "./constants";


export const isSecurityLakeAccountEqualToCurrentAccount = () => {
    logger.debug({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: `isSecurityLakeAccountEqualToCurrentAccount value is ${SECURITY_LAKE_ACCOUNT_ID === CURRENT_ACCOUNT_ID}`,
      },
    });
    return SECURITY_LAKE_ACCOUNT_ID === CURRENT_ACCOUNT_ID;
  };