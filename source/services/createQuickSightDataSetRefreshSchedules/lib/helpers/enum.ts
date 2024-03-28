// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export enum StatusTypes {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum Interval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

export enum RefreshType {
  INCREMENTAL_REFRESH = 'INCREMENTAL_REFRESH',
  FULL_REFRESH = 'FULL_REFRESH',
}

export enum SizeUnit {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
}
