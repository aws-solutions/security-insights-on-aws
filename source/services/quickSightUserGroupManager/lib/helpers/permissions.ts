// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { QuickSightUserGroup } from './interfaces';

const DASHBOARD_CO_OWNER_PERMISSIONS = [
  'quicksight:DescribeDashboard',
  'quicksight:ListDashboardVersions',
  'quicksight:UpdateDashboardPermissions',
  'quicksight:QueryDashboard',
  'quicksight:UpdateDashboard',
  'quicksight:DeleteDashboard',
  'quicksight:DescribeDashboardPermissions',
  'quicksight:UpdateDashboardPublishedVersion',
];

export const ANALYSIS_CO_OWNER_PERMISSIONS = [
  'quicksight:RestoreAnalysis',
  'quicksight:UpdateAnalysisPermissions',
  'quicksight:DeleteAnalysis',
  'quicksight:DescribeAnalysisPermissions',
  'quicksight:QueryAnalysis',
  'quicksight:DescribeAnalysis',
  'quicksight:UpdateAnalysis',
];

const DASHBOARD_VIEWER_PERMISSIONS = [
  'quicksight:DescribeDashboard',
  'quicksight:ListDashboardVersions',
  'quicksight:QueryDashboard',
];

export const DEFAULT_QUICKSIGHT_USER_GROUPS = [
  {
    GroupName: <string>process.env.QUICKSIGHT_ADMIN_USER_GROUP_NAME,
    GroupDescription: 'Admin Group',
    DashboardPermissions: DASHBOARD_CO_OWNER_PERMISSIONS,
  } as QuickSightUserGroup,
  {
    GroupName: <string>process.env.QUICKSIGHT_READ_USER_GROUP_NAME,
    GroupDescription: 'Read Only Group',
    DashboardPermissions: DASHBOARD_VIEWER_PERMISSIONS,
  } as QuickSightUserGroup,
];
