// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserAgent } from '@aws-sdk/types';

export const USER_AGENT_STRING: UserAgent = [[<string>process.env.USER_AGENT_STRING]];
export const REGION: string = process.env.AWS_REGION || '';
export const SECURITY_HUB_SSM_PARAMETER_NAME: string = process.env.SECURITY_HUB_SSM_PARAMETER_NAME!
export const VPC_FLOW_LOGS_SSM_PARAMETER_NAME: string = process.env.VPC_FLOW_LOGS_SSM_PARAMETER_NAME!
export const CLOUDTRAIL_SSM_PARAMETER_NAME: string = process.env.CLOUDTRAIL_SSM_PARAMETER_NAME!
export const APP_FABRIC_SSM_PARAMETER_NAME: string = process.env.APP_FABRIC_SSM_PARAMETER_NAME!
export const LIST_SSM_PARAMETER_NAMES: string[] = [
  SECURITY_HUB_SSM_PARAMETER_NAME,
  VPC_FLOW_LOGS_SSM_PARAMETER_NAME,
  CLOUDTRAIL_SSM_PARAMETER_NAME,
  APP_FABRIC_SSM_PARAMETER_NAME
]
