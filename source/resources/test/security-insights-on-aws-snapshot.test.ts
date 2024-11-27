// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import '@aws-cdk/assert/jest';
import { App } from 'aws-cdk-lib';
import { SynthUtils } from '@aws-cdk/assert';
import {
  SecurityInsightsOnAwsStack,
  SecurityInsightsOnAwStackProps,
} from '../lib/security-insights-on-aws-stack';

export const props: SecurityInsightsOnAwStackProps = {
  solutionBucketName: 'solutions',
  description: 'A solution for getting security insights from the data in the Security Lake',
  solutionId: 'SO0228',
  solutionName: 'security-insights-on-aws',
  solutionProvider: 'AWS Solutions',
  solutionTradeMarkName: 'security-insights-on-aws',
  solutionVersion: 'v2.0.1'
};

/*
 * Regression test.
 * Compares the synthesized cfn template from the cdk project with the snapshot in git.
 * Only update the snapshot after making sure that the differences are intended. (Deployment and extensive manual testing)
 */

test('Snapshot test for canary alarm', () => {
  const app = new App({
    context:{
    'quicksight_source_template_arn': 'arn:aws:quicksight:us-east-1:11111:template/solutions-features_Security-insights-on-aws_appFabricInsights'
    }
  });
  const stack = new SecurityInsightsOnAwsStack(app, 'SecurityInsightsStack', props);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});