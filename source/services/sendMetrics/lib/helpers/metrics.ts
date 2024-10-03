// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { logger } from '../../utils/logger';
import { SolutionMetric } from './interfaces';
import { AWS_REGION, SOLUTION_ID, UUID, SOLUTION_VERSION } from './constants';

export class MetricsManager {
  constructor (private readonly endpoint: string) {
    this.endpoint = endpoint;
  }

  public sendMetrics = async (metricsData:any) => {
    let metricsObj: SolutionMetric = this.createMetricsResposeObject(metricsData);
    await this.sendAnonymizedMetric(metricsObj);
  }
  
  private createMetricsResposeObject = (metricsData: any) => {
    return {
      TimeStamp: new Date().toISOString().replace("T", " ").replace("Z", ""),
      Solution: SOLUTION_ID,
      UUID: UUID,
      SolutionVersion: SOLUTION_VERSION,
      Region: AWS_REGION,
      Data: metricsData,
    };
  }

  private sendAnonymizedMetric = async (
    metrics: SolutionMetric,
  ): Promise<void> => {
    try {
      await axios.post(this.endpoint, JSON.stringify(metrics), {
        headers: {
            "Content-Type": "application/json"
        }}
      );
      logger.info({
        label: 'metrics/sendAnonymizedMetric',
        message: `Metrics sent successfully.`,
      });
    } catch (error) {
      logger.warn({
        label: 'metrics/sendAnonymizedMetric',
        message: `Metrics reporting failed.`,
      });
    }
  };
}
