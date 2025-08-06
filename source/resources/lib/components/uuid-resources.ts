// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Duration, CustomResource, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { CfnFunction, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement, Role, ServicePrincipal, Policy } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { addCfnNagSuppression, overrideLogicalId } from '../cdk-helper/cdk-helper';
import { NagSuppressions } from 'cdk-nag';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

export interface UUIDResourcesProps extends cdk.StackProps {
  solutionId: string;
  solutionName: string;
  solutionVersion: string;
  solutionBucketName: string;
  logLevel: string;
  runtime: Runtime;
  logGroupRetentionPeriod: number
}

export class UUIDResources extends Construct {
  public readonly uuid: string;

  constructor(scope: Construct, id: string, props: UUIDResourcesProps) {
    super(scope, id);

    const uuidGeneratorFunctionLambdaRole = new Role(this, 'UUIDGeneratorFunctionLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const uuidGeneratorFunctionPolicy = new Policy(this, 'UUIDGeneratorFunctionPolicy', {
      policyName: 'UUIDGeneratorPolicy',
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
          resources: [
            `arn:${cdk.Aws.PARTITION}:logs:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:log-group:/${cdk.Aws.PARTITION}/lambda/*`,
          ],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['iam:PassRole'],
          resources: [uuidGeneratorFunctionLambdaRole.roleArn],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['cloudformation:DescribeStacks'],
          resources: ['*'],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
          resources: ['*'],
        }),
      ],
    });

    uuidGeneratorFunctionPolicy.attachToRole(uuidGeneratorFunctionLambdaRole);
    NagSuppressions.addResourceSuppressions(uuidGeneratorFunctionPolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The DescribeStacks,  PutTraceSegments, PutTelemetryRecords actions only support * as resource',
      },
    ]);

    const deploymentSourceBucket = Bucket.fromBucketAttributes(this, 'SolutionRegionalBucket', {
      bucketName: props.solutionBucketName + '-' + cdk.Aws.REGION,
    });

    const uuidGeneratorLambdaFunction = new lambda.Function(this, 'UUIDGeneratorLambdaFunction', { //NOSONAR - This is not known code for lambda function
      runtime: props.runtime,
      description: 'UUID Generator Lambda Function',
      tracing: lambda.Tracing.ACTIVE,
      timeout: Duration.seconds(300),
      role: uuidGeneratorFunctionLambdaRole.withoutPolicyUpdates(),
      code: Code.fromBucket(deploymentSourceBucket, `${props.solutionName}/${props.solutionVersion}/uuidGenerator.zip`),
      handler: 'index.handler',
      reservedConcurrentExecutions: 1,
      environment: {
        LOG_LEVEL: props.logLevel,
      },
    });

    const cfnUUIDGeneratorLambdaFunction = uuidGeneratorLambdaFunction.node.defaultChild as CfnFunction;
    cfnUUIDGeneratorLambdaFunction.overrideLogicalId('UUIDGeneratorFunction');
    overrideLogicalId(uuidGeneratorLambdaFunction, 'UUIDGeneratorFunction');
    addCfnNagSuppression(uuidGeneratorLambdaFunction, {
      id: 'W58',
      reason: 'The lambda function has access to write logs',
    });
    addCfnNagSuppression(uuidGeneratorLambdaFunction, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC',
    });
    addCfnNagSuppression(uuidGeneratorLambdaFunction, {
      id: 'W92',
      reason:
        'The lambda function only executes on stack creation and deletion and so does not need reserved concurrency.',
    });
    addCfnNagSuppression(uuidGeneratorLambdaFunction, {
      id: 'W12',
      reason: 'Resource * is necessary for xray:PutTraceSegments and xray:PutTelemetryRecords.',
    });
    NagSuppressions.addResourceSuppressions(uuidGeneratorLambdaFunction, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);
    overrideLogicalId(uuidGeneratorFunctionLambdaRole, 'UUIDGeneratorRole');
    overrideLogicalId(uuidGeneratorFunctionPolicy, 'UUIDGeneratorPolicy');

    const uuidLogGroup = new LogGroup(this, 'SendAthenaMetricsLogGroup', {
      logGroupName: `/aws/lambda/${uuidGeneratorLambdaFunction.functionName}`,
      retention: props.logGroupRetentionPeriod,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    const uuidCustomResource = new CustomResource(this, 'UUIDCustomResource', {
      resourceType: 'Custom::UUIDGenerator',
      serviceToken: uuidGeneratorLambdaFunction.functionArn,
      properties: {
        Region: cdk.Aws.REGION,
      },
    });
    uuidCustomResource.node.addDependency(uuidGeneratorLambdaFunction);
    uuidCustomResource.node.addDependency(uuidLogGroup);

    overrideLogicalId(uuidCustomResource, 'UUIDGenerator');

    this.uuid = uuidCustomResource.getAtt('UUID').toString();

    addCfnNagSuppression(uuidLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });
  }
}
