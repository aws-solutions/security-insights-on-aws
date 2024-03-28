// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserAgent } from '@aws-sdk/types';

export const AWS_REGION = <string>process.env.AWS_REGION;
export const SEND_METRIC = <string>process.env.SEND_METRIC || '';
export const UUID = <string>process.env.UUID || 'uuid';
export const METRICS_ENDPOINT = <string>process.env.METRICS_ENDPOINT || '';
export const SOLUTION_ID = <string>process.env.SOLUTION_ID || '';
export const USER_AGENT_STRING: UserAgent = [[<string>process.env.USER_AGENT_STRING]];
