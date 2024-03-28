// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Permission } from '@aws-sdk/client-lakeformation';

export const PERMISSION_FOR_RESOURCE_LINK_DATABASE: Permission[] = ['DESCRIBE'];
export const PERMISSION_FOR_RESOURCE_LINK_DATATABLES: Permission[] = ['DESCRIBE'];
export const PERMISSION_FOR_SECURITY_LAKE_TABLES: Permission[] = ['SELECT'];
