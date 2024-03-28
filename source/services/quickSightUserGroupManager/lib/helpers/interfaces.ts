// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StatusTypes } from './constants';

export interface CompletionStatus {
  Status: StatusTypes;
  Data: {
    AdminGroupArn: string;
    ReadGroupArn: string;
  };
}

export interface QuickSightUserGroup {
  GroupName: string;
  GroupDescription: string;
  DashboardPermissions: string[];
}
