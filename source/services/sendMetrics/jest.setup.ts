// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

process.env.SOLUTION_ID = 'SolTest1234';
process.env.UUID = '1234';
process.env.METRICS_ENDPOINT = 'endpoint';
process.env.AWS_REGION	= 'us-east-1'
process.env.ATHENA_WORKGROUP = 'testWorkgroup'
process.env.SOLUTION_VERSION = 'testVersion'
process.env.INPUT_PARAMETER_FREQUENCY = 'Daily'
process.env.INPUT_PARAMETER_WEEKLY_REFRESH_DAY = 'Monday'
process.env.INPUT_PARAMETER_MONTHLY_REFRESH_DAY = '1'
process.env.INPUT_PARAMETER_LOG_LEVEL = 'Info'
process.env.INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM = '100'
process.env.INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM = 'GB'
process.env.INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS = 'No'
process.env.INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS = 'Yes'
process.env.INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION = 'Yes'
