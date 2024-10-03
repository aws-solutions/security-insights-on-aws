// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserAgent } from '@aws-sdk/types';

export const AWS_REGION = <string>process.env.AWS_REGION;
export const SEND_METRIC = <string>process.env.SEND_METRIC || '';
export const UUID = <string>process.env.UUID || 'uuid';
export const METRICS_ENDPOINT = <string>process.env.METRICS_ENDPOINT || '';
export const SOLUTION_ID = <string>process.env.SOLUTION_ID || '';
export const SOLUTION_VERSION = <string>process.env.SOLUTION_VERSION || '';
export const USER_AGENT_STRING: UserAgent = [[<string>process.env.USER_AGENT_STRING]];
export const INPUT_PARAMETER_FREQUENCY = process.env.INPUT_PARAMETER_FREQUENCY
export const INPUT_PARAMETER_WEEKLY_REFRESH_DAY = process.env.INPUT_PARAMETER_WEEKLY_REFRESH_DAY
export const INPUT_PARAMETER_MONTHLY_REFRESH_DAY = process.env.INPUT_PARAMETER_MONTHLY_REFRESH_DAY
export const INPUT_PARAMETER_LOG_LEVEL = process.env.INPUT_PARAMETER_LOG_LEVEL
export const INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM = process.env.INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM
export const INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM = process.env.INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM
export const INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS = process.env.INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS
export const INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS = process.env.INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS
export const INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION = process.env.INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION
