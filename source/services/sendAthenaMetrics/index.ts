// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context, EventBridgeEvent } from 'aws-lambda';
import { AthenaClient, GetQueryExecutionCommand, GetQueryExecutionCommandOutput } from '@aws-sdk/client-athena';
import { logger } from './utils/logger';
import { Metrics } from './lib/metrics';
import { AWS_REGION, USER_AGENT_STRING, SEND_METRIC, METRICS_ENDPOINT } from './lib/constants';
import { EventDetail, SolutionMetric } from './lib/interfaces';

export async function handler(event: EventBridgeEvent<string, EventDetail>, _context: Context): Promise<void> {
  
  if (metricsEnabled()) {
    let athenaClient = getAthenaClient();
    let execDetails = await getQueryExecutionDetails(athenaClient, event.detail.queryExecutionId);
    let metricsObj: SolutionMetric = createMetricsResposeObject(execDetails);
    await Metrics.sendAnonymizedMetric(METRICS_ENDPOINT, metricsObj);
  }
}

function getAthenaClient() {
  return new AthenaClient({
    region: AWS_REGION,
    customUserAgent: USER_AGENT_STRING,
    logger: logger,
  });
}

function createMetricsResposeObject(athenaResponse: GetQueryExecutionCommandOutput) {
  const queryExecution = athenaResponse.QueryExecution;
  const queryExecutionStatistics = queryExecution?.Statistics;
  const queryExecutionStatus = queryExecution?.Status
  return {
    TimeStamp: queryExecutionStatus?.CompletionDateTime!.toISOString().replace('T', ' ').replace('Z', ''),
    Solution: <string>process.env.SOLUTION_ID,
    UUID: <string>process.env.UUID,
    Data: {
      DataScannedInBytes: String(queryExecutionStatistics?.DataScannedInBytes) || '',
      EngineExecutionTimeInMillis: String(queryExecutionStatistics?.EngineExecutionTimeInMillis) || '',
      QueryPlanningTimeInMillis: String(queryExecutionStatistics?.QueryPlanningTimeInMillis) || '',
      QueryQueueTimeInMillis: String(queryExecutionStatistics?.QueryQueueTimeInMillis) || '',
      ServiceProcessingTimeInMillis: String(queryExecutionStatistics?.ServiceProcessingTimeInMillis) || '',
      TotalExecutionTimeInMillis: String(queryExecutionStatistics?.TotalExecutionTimeInMillis) || '',
      Status: String(queryExecution?.Status?.State) || '',
      StatementType: String(queryExecution?.StatementType) || '',
      SubstatementType: String(queryExecution?.SubstatementType) || '',
      WorkGroup: <string>process.env.ATHENA_WORKGROUP,
      Version: <string>process.env.SOLUTION_VERSION,
      Region: AWS_REGION,
    },
  };
}

const getQueryExecutionDetails = async (athenaClient: AthenaClient, queryExecutionID: string) => {
  return await athenaClient.send(new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionID }));
};

function metricsEnabled(): boolean {
  return SEND_METRIC === 'True';
}