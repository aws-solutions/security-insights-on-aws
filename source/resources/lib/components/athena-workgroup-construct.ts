// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Construct } from 'constructs';
import { CfnWorkGroup } from 'aws-cdk-lib/aws-athena';
import { BlockPublicAccess, Bucket, BucketEncryption, BucketPolicy } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Aws, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { addCfnNagSuppression } from '../cdk-helper/cdk-helper';

export interface AthenaWorkGroupProps {
  athenaWorkGroupName: string;
  athenaWorkGroupDescription: string;
  athenaWorkGroupBucketName: string;
  athenaBucketPrefix: string;
}

export class AthenaWorkGroup extends Construct {
  public readonly athenaWorkGroupBucket: Bucket;
  public readonly athenaWorkGroupName: string;
  public readonly athenaWorkGroup: CfnWorkGroup;

  constructor(scope: Construct, id: string, props: AthenaWorkGroupProps) {
    super(scope, id);

    const accessLoggingBucket = new Bucket(this, 'AccessLoggingBucket', { // NOSONAR - The use case does not need bucket versioning
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      enforceSSL: true,
      lifecycleRules: [
        {
          enabled: true,
          expiration: cdk.Duration.days(180),
          id: 'DeletionRule',
        },
      ],
    });
    addCfnNagSuppression(accessLoggingBucket, {
      id: 'W35',
      reason: ' Access logging is not required for this bucket.',
    });
    addCfnNagSuppression(accessLoggingBucket, {
      id: 'W51',
      reason: 'Policy is not required for this bucket.',
    });

    const athenaWorkgroupBucket = new Bucket(this, 'AthenaWorkgroupBucket', { // NOSONAR - The use case does not need bucket versioning
      bucketName: props.athenaWorkGroupBucketName,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      serverAccessLogsBucket: accessLoggingBucket,
      serverAccessLogsPrefix: 'athena_results/',
      lifecycleRules: [
        {
          enabled: true,
          expiration: Duration.days(180),
          id: 'DeletionRule',
        },
      ],
    });

    const athenaWorkgroupBucketPolicy = athenaWorkgroupBucket.policy as BucketPolicy;
    addCfnNagSuppression(athenaWorkgroupBucketPolicy, {
      id: 'W51',
      reason: 'Policy is not required for this bucket.',
    });

    const athenaWorkgroup = new CfnWorkGroup(this, 'AthenaWorkGroup', {
      name: props.athenaWorkGroupName,
      description: props.athenaWorkGroupDescription,
      state: 'ENABLED',
      recursiveDeleteOption: true,
      workGroupConfiguration: {
        enforceWorkGroupConfiguration: true,
        publishCloudWatchMetricsEnabled: true,
        resultConfiguration: {
          encryptionConfiguration: {
            encryptionOption: 'SSE_S3',
          },
          expectedBucketOwner: Aws.ACCOUNT_ID,
          outputLocation: `s3://${athenaWorkgroupBucket.bucketName}/${props.athenaBucketPrefix}`,
        },
      },
    });

    this.athenaWorkGroupName = athenaWorkgroup.name;
    this.athenaWorkGroupBucket = athenaWorkgroupBucket;
    this.athenaWorkGroup = athenaWorkgroup

  }
}
