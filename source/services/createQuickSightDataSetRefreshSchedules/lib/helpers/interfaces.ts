// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { RefreshConfiguration } from '@aws-sdk/client-quicksight';
import { StatusTypes, DayOfWeek, Interval, RefreshType } from './enum';

export interface CompletionStatus {
  Status: StatusTypes;
  Data: Record<string, unknown> | { Error?: { Code: string; Message: string } };
}

export interface EventDetail {
  name: string;
  type: string;
  operation: string;
}

export interface RefreshScheduleConfiguration {
  Frequency: string;
  DayOfWeek: string;
  DayOfMonth: string;
}

export interface RefreshOnDay {
  DayOfWeek?: DayOfWeek;
  DayOfMonth?: string;
}

export interface ScheduleFrequency {
  Interval: Interval;
  RefreshOnDay?: RefreshOnDay;
}

export interface Schedule {
  ScheduleId: string;
  ScheduleFrequency: ScheduleFrequency;
  RefreshType: RefreshType;
}

export interface DataSetRefreshProperties {
  RefreshConfiguration: RefreshConfiguration;
}
