// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { EventBridgeEvent } from 'aws-lambda';
import { AthenaOperations } from '../serviceOperations/athenaOperations';
import { AthenaEventDetail, DataSourceConfiguration, SSMParameterEventDetail, OpsItemEventDetail } from '../helpers/interfaces';
import { SSMOperations } from '../serviceOperations/ssmOperations';
import { logger } from '../../utils/logger';
import { MetricsManager } from '../helpers/metrics';
import { GetQueryExecutionCommandOutput } from '@aws-sdk/client-athena';
export class EventBridgeEventHandler {
  constructor(
    private event: EventBridgeEvent<string, SSMParameterEventDetail | AthenaEventDetail | OpsItemEventDetail>,
    private athenaOperations: AthenaOperations,
    private ssmOperations: SSMOperations,
    private metricsManager: MetricsManager
  ) {
    this.event = event;
    this.athenaOperations = athenaOperations;
    this.ssmOperations = ssmOperations;
    this.metricsManager = metricsManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'SendMetrics/Handler',
      message: {
        data: 'handleEvent invoked',
      },
    });
    let metricsData: any = {}
    if (this.event['detail-type'].toString().includes('Athena Query State Change')) {
      metricsData = await this.getAthenaMetrics()
    } else if (this.event['detail-type'].toString().includes('Parameter Store Change')) {
      metricsData = await this.getSSMParameterMetrics()
    } else if (this.event['detail-type'].toString().includes('OpsItem')) {
      metricsData = this.getOpsItemMetrics()
    }
    await this.metricsManager.sendMetrics(metricsData)
  };

  private getAthenaMetrics = async() => {
    let execDetails = await this.athenaOperations.getQueryExecutionDetails(
      (this.event as EventBridgeEvent<string, AthenaEventDetail>).detail.queryExecutionId
    );
    let athenaMetricsObj = this.createAthenaMetricsResponseObject(execDetails);
    return athenaMetricsObj;
  }

  private createAthenaMetricsResponseObject = (athenaResponse: GetQueryExecutionCommandOutput) => {
    const queryExecution = athenaResponse.QueryExecution;
    const queryExecutionStatistics = queryExecution?.Statistics;
    return {
      "AthenaExecutionMetrics": {
        "DataScannedInBytes": String(queryExecutionStatistics?.DataScannedInBytes) || '',
        "EngineExecutionTimeInMillis": String(queryExecutionStatistics?.EngineExecutionTimeInMillis) || '',
        "QueryPlanningTimeInMillis": String(queryExecutionStatistics?.QueryPlanningTimeInMillis) || '',
        "QueryQueueTimeInMillis": String(queryExecutionStatistics?.QueryQueueTimeInMillis) || '',
        "ServiceProcessingTimeInMillis": String(queryExecutionStatistics?.ServiceProcessingTimeInMillis) || '',
        "TotalExecutionTimeInMillis": String(queryExecutionStatistics?.TotalExecutionTimeInMillis) || '',
        "Status": String(queryExecution?.Status?.State) || '',
        "StatementType": String(queryExecution?.StatementType) || '',
        "SubstatementType": String(queryExecution?.SubstatementType) || '',
        "WorkGroup": <string>process.env.ATHENA_WORKGROUP,
      }
    };
  }

  private getSSMParameterMetrics = async() => {
    let ssmParameterName = (this.event as EventBridgeEvent<string, SSMParameterEventDetail>).detail.name
    let dataSourceName = ssmParameterName.split('/')[4]
    let dataSourceConfiguration: DataSourceConfiguration = await this.ssmOperations.getDataSourceConfiguration(ssmParameterName);
    return {
      "SSMParameterMetrics": {
        "DataSourceName": dataSourceName,
        "DataSourceStatus": dataSourceConfiguration.status,
        "QueryWindowDuration": dataSourceConfiguration.queryWindowDuration,
      }
     
    }
  }

  private getOpsItemMetrics = () => {
    return {
      "OpsItemMetrics": {
        "Detail-Type": this.event['detail-type'],
        "Status": (this.event as EventBridgeEvent<string, OpsItemEventDetail>).detail.status,
        "Title": (this.event as EventBridgeEvent<string, OpsItemEventDetail>).detail.title 
      }
    }
  }

}
