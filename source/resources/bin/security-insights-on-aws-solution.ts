// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { Aspects, DefaultStackSynthesizer } from 'aws-cdk-lib';
import { SecurityInsightsOnAwsStack, SecurityInsightsOnAwStackProps } from '../lib/security-insights-on-aws-stack';

function getEnvElement(envVariableName: string): string {
  const value: string | undefined = process.env[envVariableName];
  if (value == undefined) throw new Error(`Missing required environment variable ${envVariableName}`);
  return value;
}

const SOLUTION_VERSION = getEnvElement('SOLUTION_VERSION');
const SOLUTION_NAME = getEnvElement('SOLUTION_NAME');
const SOLUTION_ID = process.env['SOLUTION_ID'] || 'SO0228';
const SOLUTION_BUCKET_NAME = getEnvElement('DIST_OUTPUT_BUCKET');
const SOLUTION_TMN = getEnvElement('SOLUTION_TRADEMARKEDNAME');
const SOLUTION_PROVIDER = 'AWS Solution Development';

const app = new cdk.App();

let securityInsightsOnAwsStackProperties: SecurityInsightsOnAwStackProps = {
  solutionId: SOLUTION_ID,
  solutionTradeMarkName: SOLUTION_TMN,
  solutionProvider: SOLUTION_PROVIDER,
  solutionBucketName: SOLUTION_BUCKET_NAME,
  solutionName: SOLUTION_NAME,
  solutionVersion: SOLUTION_VERSION,
  description:
    '(' +
    SOLUTION_ID +
    ') - ' +
    SOLUTION_NAME +
    ': A solution for getting security insights from the data in the Security Lake for the solution version ' +
    SOLUTION_VERSION,
  synthesizer: new DefaultStackSynthesizer({
    generateBootstrapVersionRule: false,
  }),
};

new SecurityInsightsOnAwsStack(app, 'security-insights-on-aws', securityInsightsOnAwsStackProperties); //NOSONAR - This initialization is is for construct creation
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));