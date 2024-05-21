// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StatusTypes } from './enum';

export interface ErrorDetails {
  Code: string,
  Message: string
}

export interface CfnResponseData {
  Status: StatusTypes;
  Data?: Record<string, any>;
  Error?: ErrorDetails;
}
