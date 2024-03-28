// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { logger } from '../utils/logger';
import { SolutionMetric } from './interfaces';

/**
 * Send metrics to solutions endpoint
 * @class Metrics
 */
export class Metrics {
  /**
   * Sends anonymized metric
   * @param {object} metrics - metric JSON data
   */
  static sendAnonymizedMetric = async (
    endpoint: string,
    metrics: SolutionMetric,
  ): Promise<void> => {
    try {
      await axios.post(endpoint, JSON.stringify(metrics), {
        headers: {
            "Content-Type": "application/json"
        }}
      )
    } catch (error) {
      logger.warn({
        label: 'metrics/sendAnonymizedMetric',
        message: `Metrics reporting failed.`,
      });
    }
  };
}
