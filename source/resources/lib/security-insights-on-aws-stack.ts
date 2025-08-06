// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import {
  Aws,
  CfnCondition,
  CfnOutput,
  CfnParameter,
  CustomResource,
  Duration,

  RemovalPolicy,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AthenaWorkGroup } from './components/athena-workgroup-construct';
import { CfnAnalysis, CfnDashboard, CfnTopic } from 'aws-cdk-lib/aws-quicksight';
import { Key } from 'aws-cdk-lib/aws-kms';
import { GlueDatabase } from './components/glue-database-construct';
import { GlueDataTable } from './components/glue-data-table-construct';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { EventbridgeToLambda } from '@aws-solutions-constructs/aws-eventbridge-lambda';
import { Code, Function as AwsLambdaFunction, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { Effect, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as placeholderDataTables from './components/placeholderDataTables/index';
import { addCfnNagSuppression, setCondition } from './cdk-helper/cdk-helper';
import * as events_targets from 'aws-cdk-lib/aws-events-targets';
import * as permissions from './permissions';
import {
  CREATE_LOG_GROUP_PERMISSIONS,
  DATA_SET_ARNS,
  GLUE_PERMISSIONS,
  INGESTION_ARNS,
  QUICKSIGHT_ANALYSIS_ACTIONS,
  QUICKSIGHT_DASHBOARD_ACTIONS,
  QUICKSIGHT_DATASET_PERMISSIONS,
  QUICKSIGHT_DATASOURCE_PERMISSIONS,
  QUICKSIGHT_INGESTION_PERMISSIONS,
  QUICKSIGHT_LIST_INGESTION_PERMISSIONS,
  QUICKSIGHT_UPDATE_DATASET_PERMISSIONS,
  REFRESH_SCHEDULE_ARNS,
  REFRESH_SCHEDULE_PERMISSIONS,
  SSM_GET_PARAMETER_PERMISSIONS,
  XRAY_ACTIONS,
} from './permissions';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { UUIDResources, UUIDResourcesProps } from './components/uuid-resources';
import * as SNS from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction, SnsTopic } from 'aws-cdk-lib/aws-events-targets';
import { NagSuppressions } from 'cdk-nag';
import { Alarm, ComparisonOperator, Metric, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { DataFormat } from '@aws-cdk/aws-glue-alpha';
import {
  DEFAULT_APP_FABRIC_TABLE_NAME,
  DEFAULT_CLOUDTRAIL_TABLE_NAME,
  DEFAULT_SECURITY_HUB_TABLE_NAME,
  DEFAULT_VPC_TABLE_NAME,
} from './components/placeholderDataTables/constants';
import * as schedule from '@aws-cdk/aws-scheduler-alpha';
import * as targets from '@aws-cdk/aws-scheduler-targets-alpha';

export interface SecurityInsightsOnAwStackProps extends cdk.StackProps {
  solutionId: string;
  solutionTradeMarkName: string;
  solutionProvider: string;
  solutionBucketName: string;
  description: string;
  solutionName: string;
  solutionVersion: string;
}

export class SecurityInsightsOnAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SecurityInsightsOnAwStackProps) {
    super(scope, id, props);

    const quickSightUserNameArn = new CfnParameter(this, 'QuickSightUserNameArn', {
      description: 'ARN for QuickSight username who will be the admin for this deployment',
      type: 'String',
      allowedPattern: '^arn:(.+):quicksight:(.+):(.+):user/(.+)$',
    });
    const frequency = new CfnParameter(this, 'Frequency', {
      type: 'String',
      description: 'Frequency for dataset refresh',
      default: 'Weekly',
      allowedValues: ['Daily', 'Weekly', 'Monthly'],
    });
    const weeklyRefreshDay = new CfnParameter(this, 'WeeklyRefreshDay', {
      type: 'String',
      description: 'Day for weekly refresh of dataset. Select this option only if the Frequency is Weekly.',
      default: 'Monday',
      allowedValues: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    });
    const monthlyRefreshDay = new CfnParameter(this, 'MonthlyRefreshDay', {
      type: 'String',
      description: 'Day for monthly refresh of dataset. Select this option only if the Frequency is Monthly.',
      default: '1',
      allowedValues: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        'Last day of month',
      ],
    });
    const emailID = new CfnParameter(this, 'EmailID', {
      type: 'String',
      description: 'Email ID to receive the QuickSight DataSet alerts',
      allowedPattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
    });
    const logLevel = new CfnParameter(this, 'LogLevel', {
      type: 'String',
      description: 'Log level for lambda functions',
      default: 'Info',
      allowedValues: ['Info', 'Debug', 'Error', 'Warn'],
    });
    const securityLakeAccountId = new CfnParameter(this, 'SecurityLakeAccountId', {
      type: 'String',
      description: 'Account Id in which Security Lake is created',
    });
    const thresholdValueForAthenaAlarm = new CfnParameter(this, 'ThresholdValueForAthenaAlarm', {
      type: 'Number',
      description: 'Threshold value in GB for Athena Alarm',
      default: 100,
    });
    const thresholdUnitForAthenaAlarm = new CfnParameter(this, 'ThresholdUnitForAthenaAlarm', {
      type: 'String',
      description: 'Unit for threshold value for Athena Alarm',
      default: 'GB',
      allowedValues: ['GB', 'TB', 'PB', 'EB'],
    });
    const createQuickSightUserGroups = new CfnParameter(this, 'CreateQuickSightUserGroups', {
      type: 'String',
      description: 'Select Yes to create QuickSight User groups. If you use Identity Center to manage QuickSight User Groups, select No',
      default: 'Yes',
      allowedValues: ['No', 'Yes'],
    });
    const createQuickSightQTopics = new CfnParameter(this, 'CreateQuickSightQTopics', {
      type: 'String',
      description: 'Select Yes to create Amazon Q Topics for QuickSight. This allows you to query your data in natural language. Select No if your deployment region does not support Q',
      default: 'Yes',
      allowedValues: ['No', 'Yes'],
    });
    const createSolutionReleaseNotification = new CfnParameter(this, 'CreateNewSolutionReleaseNotification', {
      description: 'Select Yes to get notified when a new version of this solution is released.',
      type: 'String',
      default: 'Yes',
      allowedValues: ['No', 'Yes'],
    });
    this.templateOptions.metadata = {
      'AWS::CloudFormation::Interface': {
        ParameterGroups: [
          {
            Label: { default: 'Security Lake Settings' },
            Parameters: [securityLakeAccountId.logicalId],
          },
          {
            Label: { default: 'QuickSight Settings' },
            Parameters: [quickSightUserNameArn.logicalId, createQuickSightUserGroups.logicalId, createQuickSightQTopics.logicalId],
          },
          {
            Label: { default: 'QuickSight Dataset Refresh Settings' },
            Parameters: [frequency.logicalId, weeklyRefreshDay.logicalId, monthlyRefreshDay.logicalId],
          },
          {
            Label: { default: 'Log Level' },
            Parameters: [logLevel.logicalId],
          },
          {
            Label: { default: 'Notifications' },
            Parameters: [emailID.logicalId, createSolutionReleaseNotification.logicalId],
          },
          {
            Label: { default: 'Athena Configuration' },
            Parameters: [thresholdValueForAthenaAlarm.logicalId, thresholdUnitForAthenaAlarm.logicalId],
          },
        ],
        ParameterLabels: {
          [quickSightUserNameArn.logicalId]: {
            default: 'ARN for QuicksSight admin user',
          },
          [frequency.logicalId]: {
            default: 'Frequency for QuickSight Dataset refresh',
          },
          [weeklyRefreshDay.logicalId]: {
            default: 'Day of the week for weekly refresh of QuickSight Dataset',
          },
          [monthlyRefreshDay.logicalId]: {
            default: 'Day of the month for monthly refresh of QuickSight Dataset',
          },
          [emailID.logicalId]: {
            default: 'Email ID to receive QuickSight Dataset refresh alerts',
          },
          [logLevel.logicalId]: {
            default: 'Log level for the lambda functions',
          },
          [securityLakeAccountId.logicalId]: {
            default: 'Account Id where security lake is created',
          },
          [thresholdValueForAthenaAlarm.logicalId]: {
            default: 'Threshold value in GB for Alarm on Athena WorkGroup',
          },
          [thresholdUnitForAthenaAlarm.logicalId]: {
            default: 'Unit for threshold value for Athena Alarm',
          },
          [createQuickSightUserGroups.logicalId]: {
            default: 'Create QuickSight User Groups',
          },
          [createQuickSightQTopics.logicalId]: {
            default: 'Create Amazon Q Topics for QuickSight',
          },
          [createSolutionReleaseNotification.logicalId]: {
            default: 'Receive notification when new version of the solution is released',
          },
        },
      },
    };

    const mappings = new cdk.CfnMapping(this, 'Solution');
    mappings.setValue('SolutionConfiguration', 'ID', props.solutionId);
    mappings.setValue('SolutionConfiguration', 'Version', props.solutionVersion);
    mappings.setValue('SolutionConfiguration', 'SendAnonymizedUsageData', 'True');
    mappings.setValue('SolutionConfiguration', 'MetricsURL', 'https://metrics.awssolutionsbuilder.com/generic');
    mappings.setValue('SolutionConfiguration', 'SolutionName', 'Security Insights on AWS');
    mappings.setValue('SolutionConfiguration', 'UserAgentString', '');
    mappings.setValue('SolutionConfiguration', 'ApplicationType', 'AWS-Solutions');
    mappings.setValue('SolutionConfiguration', 'GitHubRepoUrl', 'https://api.github.com/repos/aws-solutions/security-insights-on-aws/releases/latest');
    mappings.setValue('SecurityLakeConfiguration', 'SecurityLakeTablePrefix', 'amazon_security_lake_table');
    mappings.setValue('SecurityLakeConfiguration', 'SecurityLakeDatabasePrefix', 'amazon_security_lake_glue_db');
    mappings.setValue('SecurityLakeConfiguration', 'SecurityLakeVpcTableName', 'vpc_flow_2_0');
    mappings.setValue('SecurityLakeConfiguration', 'SecurityLakeCloudtrailTableName', 'cloud_trail_mgmt_2_0');
    mappings.setValue('SecurityLakeConfiguration', 'SecurityLakeSecurityHubTableName', 'sh_findings_2_0');
    mappings.setValue('SecurityLakeConfiguration', 'SecurityLakeAppFabricTableName', 'ext_awsappfabric');
    mappings.setValue('SecurityLakeConfiguration', 'ResourceLinkDatabase', 'aws_solutions_resource_link_database');
    mappings.setValue('SecurityLakeConfiguration', 'VpcDataSourceName', 'vpcFlowLogs');
    mappings.setValue('SecurityLakeConfiguration', 'CloudtrailDataSourceName', 'cloudtrail');
    mappings.setValue('SecurityLakeConfiguration', 'SecurityHubDataSourceName', 'securityHub');
    mappings.setValue('SecurityLakeConfiguration', 'DefaultQueryWindowDuration', '7');
    mappings.setValue('InputConfiguration', 'Info', 'info');
    mappings.setValue('InputConfiguration', 'Debug', 'debug');
    mappings.setValue('InputConfiguration', 'Error', 'error');
    mappings.setValue('InputConfiguration', 'Warn', 'warn');
    mappings.setValue('InputConfiguration', 'Monday', 'MONDAY');
    mappings.setValue('InputConfiguration', 'Tuesday', 'TUESDAY');
    mappings.setValue('InputConfiguration', 'Wednesday', 'WEDNESDAY');
    mappings.setValue('InputConfiguration', 'Thursday', 'THURSDAY');
    mappings.setValue('InputConfiguration', 'Friday', 'FRIDAY');
    mappings.setValue('InputConfiguration', 'Saturday', 'SATURDAY');
    mappings.setValue('InputConfiguration', 'Sunday', 'SUNDAY');
    mappings.setValue('GlueConfiguration', 'GlueDatabaseName', 'security_insights_database');
    mappings.setValue('GlueConfiguration', 'GlueTableName', 'security_insights_table');
    mappings.setValue('GlueConfiguration', 'GlueTableBucketPrefix', '/placeholderValues');
    mappings.setValue('AthenaConfiguration', 'AthenaWorkgroupName', 'SecurityInsights');
    mappings.setValue('AthenaConfiguration', 'AthenaBucketPrefix', 'athena_results/');
    mappings.setValue('AthenaConfiguration', 'AthenaWorkgroupBucketName', 'aws-athena-query-results-solutions-');
    mappings.setValue(
      'QuickSightConfiguration',
      'QuickSightDataSourceName',
      'DataAthenaDataSourceSecurityInsightsSource',
    );
    mappings.setValue('QuickSightConfiguration', 'QuickSightDataSourceId', 'AthenaDataSourceSecurityInsights');
    mappings.setValue('QuickSightConfiguration', 'QuickSightDataSetName', 'DataSet');
    mappings.setValue('QuickSightConfiguration', 'QuickSightDataSetId', 'DataSetId');
    mappings.setValue('QuickSightConfiguration', 'QuickSightAnalysisName', 'SecurityInsightsAnalysis');
    mappings.setValue('QuickSightConfiguration', 'QuickSightAnalysisId', 'SecurityInsightsAnalysis');
    mappings.setValue('QuickSightConfiguration', 'QuickSightDashboardName', 'SecurityInsightsDashboard');
    mappings.setValue('QuickSightConfiguration', 'QuickSightDashboardId', 'SecurityInsightsDashboard');
    mappings.setValue('QuickSightConfiguration', 'QuickSightServiceLinkedRoleName', 'aws-quicksight-service-role-v0');
    mappings.setValue('QuickSightConfiguration', 'RefreshType', 'FULL_REFRESH');
    mappings.setValue('QuickSightConfiguration', 'AdminUserGroupName', 'AdminUserGroup');
    mappings.setValue('QuickSightConfiguration', 'ReadUserGroupName', 'ReadUserGroup');
    mappings.setValue('LambdaFunctionConfiguration', 'CreateQuickSightDataSetFunctionName', 'CreateQuickSightDataSets');
    mappings.setValue(
      'LambdaFunctionConfiguration',
      'CreateLakeFormationPermissionsFunctionName',
      'CreateLakeFormationPermissions',
    );
    mappings.setValue(
      'LambdaFunctionConfiguration',
      'CreateDataSetRefreshSchedulesFunctionName',
      'CreateDataSetRefreshSchedules',
    );
    const LAMBDA_RUNTIME = Runtime.NODEJS_20_X;
    const LAMBDA_MEMORY_SIZE = 128;
    const LAMBDA_TIMEOUT_DURATION = 300;
    const SEND_METRICS_LAMBDA_TIMEOUT_DURATION = 90;
    const LAMBDA_LOG_GROUP_RETENTION_PERIOD = RetentionDays.ONE_YEAR;
    const QUICKSIGHT_ENDPOINT_REGION = Aws.REGION;
    const SECURITY_LAKE_VPC_TABLE_NAME = cdk.Fn.join('_', [
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeTablePrefix'),
      cdk.Fn.join('_', cdk.Fn.split('-', Aws.REGION)),
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeVpcTableName'),
    ]);
    const SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME = cdk.Fn.join('_', [
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeTablePrefix'),
      cdk.Fn.join('_', cdk.Fn.split('-', Aws.REGION)),
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeCloudtrailTableName'),
    ]);
    const SECURITY_LAKE_APP_FABRIC_TABLE_NAME = cdk.Fn.join('_', [
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeTablePrefix'),
      cdk.Fn.join('_', cdk.Fn.split('-', Aws.REGION)),
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeAppFabricTableName'),
    ]);
    const SECURITY_LAKE_SECURITY_HUB_TABLE_NAME = cdk.Fn.join('_', [
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeTablePrefix'),
      cdk.Fn.join('_', cdk.Fn.split('-', Aws.REGION)),
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeSecurityHubTableName'),
    ]);
    const SECURITY_LAKE_DATABASE_NAME = cdk.Fn.join('_', [
      mappings.findInMap('SecurityLakeConfiguration', 'SecurityLakeDatabasePrefix'),
      cdk.Fn.join('_', cdk.Fn.split('-', Aws.REGION)),
    ]);
    const QUICKSIGHT_PRINCIPAL_ARN = quickSightUserNameArn.valueAsString;
    const DATA_SOURCE_ARN = `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${
      Aws.ACCOUNT_ID
    }:datasource/${mappings.findInMap('QuickSightConfiguration', 'QuickSightDataSourceId')}`;
    const QUICKSIGHT_SERVICE_LINKED_ROLE = `arn:${Aws.PARTITION}:iam::${
      Aws.ACCOUNT_ID
    }:role/service-role/${mappings.findInMap('QuickSightConfiguration', 'QuickSightServiceLinkedRoleName')}`;
    const LAMBDA_LOG_GROUP_ARN = `arn:${cdk.Aws.PARTITION}:logs:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:log-group:/${cdk.Aws.PARTITION}/lambda/*`;
    const DEFAULT_QUERY_WINDOW_DURATION = mappings.findInMap('SecurityLakeConfiguration', 'DefaultQueryWindowDuration');
    const RESOURCE_LINK_DATABASE_NAME = mappings.findInMap('SecurityLakeConfiguration', 'ResourceLinkDatabase');
    const QUICKSIGHT_ANALYSIS_NAME = cdk.Fn.join('-', [
      mappings.findInMap('QuickSightConfiguration', 'QuickSightAnalysisName'),
      Aws.REGION,
    ]);
    const QUICKSIGHT_DASHBOARD_NAME = cdk.Fn.join('-', [
      mappings.findInMap('QuickSightConfiguration', 'QuickSightDashboardName'),
      Aws.REGION,
    ]);
    const QUICKSIGHT_ADMIN_USER_GROUP_NAME = cdk.Fn.join('-', [
      mappings.findInMap('QuickSightConfiguration', 'AdminUserGroupName'),
      Aws.REGION,
    ]);
    const QUICKSIGHT_READ_USER_GROUP_NAME = cdk.Fn.join('-', [
      mappings.findInMap('QuickSightConfiguration', 'ReadUserGroupName'),
      Aws.REGION,
    ]);
    const USER_AGENT_STRING = cdk.Fn.sub('AWSSOLUTION/${SolutionID}/${Version}', {
      SolutionID: mappings.findInMap('SolutionConfiguration', 'ID'),
      Version: mappings.findInMap('SolutionConfiguration', 'Version'),
    });
    const EVALUATION_PERIOD_FOR_ATHENA_ALARM = 1;
    const DATA_POINTS_FOR_ATHENA_ALARM = 1;
    const DELAY_IN_SECONDS_FOR_RATE_LIMITING = '1';

    const SECURITY_HUB_SSM_PARAMETER_NAME = `/solutions/securityInsights/${Aws.REGION}/securityHub`
    const VPC_FLOW_LOGS_SSM_PARAMETER_NAME = `/solutions/securityInsights/${Aws.REGION}/vpcFlowLogs`
    const CLOUDTRAIL_SSM_PARAMETER_NAME = `/solutions/securityInsights/${Aws.REGION}/cloudtrail`
    const APP_FABRIC_SSM_PARAMETER_NAME = `/solutions/securityInsights/${Aws.REGION}/appfabric`
    const DELAY_IN_SECONDS_FOR_DATA_SOURCE_CREATION = '10'
    const DELAY_IN_SECONDS_FOR_DATA_SOURCE_UPDATE = '120'

    /**
     * Condition for QuickSight User Groups
     */

    const createQuickSightUserGroupsCondition = new cdk.CfnCondition(this, 'CreateQuickSightUserGroupsCondition', {
      expression: cdk.Fn.conditionEquals(createQuickSightUserGroups.valueAsString, 'Yes'),
    });

    /**
     * Condition for Q for QuickSight topics
     */
    const createQuickSightQTopicsCondition = new cdk.CfnCondition(this, 'CreateQuickSightQTopicsCondition', {
      expression: cdk.Fn.conditionEquals(createQuickSightQTopics.valueAsString, 'Yes'),
    });

     /**
     * Condition for Solution Release Notification Lambda
     */
     const createSolutionReleaseNotificationCondition = new cdk.CfnCondition(this, 'CreateSolutionReleaseNotificationCondition', {
      expression: cdk.Fn.conditionEquals(createSolutionReleaseNotification.valueAsString, 'Yes'),
    });

    /**
     * Athena Resources
     */

    const athenaWorkGroup = new AthenaWorkGroup(this, 'AthenaWorkGroup', {
      athenaWorkGroupName: cdk.Fn.join('-', [
        mappings.findInMap('AthenaConfiguration', 'AthenaWorkgroupName'),
        Aws.REGION,
      ]),
      athenaWorkGroupDescription: 'Athena WorkGroup for Security Insights Solution',
      athenaWorkGroupBucketName: cdk.Fn.join('-', [
        mappings.findInMap('AthenaConfiguration', 'AthenaWorkgroupBucketName'),
        cdk.Fn.select(0, cdk.Fn.split('-', cdk.Fn.select(2, cdk.Fn.split('/', `${Aws.STACK_ID}`)))),
      ]),
      athenaBucketPrefix: mappings.findInMap('AthenaConfiguration', 'AthenaBucketPrefix'),
    });

    /**
     * Glue Resources
     */

    const listOfQuickSightPrincipals: { name: string; arn: string }[] = [
      { name: 'quickSightServiceLinkedRole', arn: QUICKSIGHT_SERVICE_LINKED_ROLE },
      { name: 'quickSightAdmin', arn: QUICKSIGHT_PRINCIPAL_ARN },
    ];
    const glueDatabase = new GlueDatabase(this, 'GlueDatabase', {
      databaseName: cdk.Fn.join('-', [
        mappings.findInMap('GlueConfiguration', 'GlueDatabaseName'),
        Aws.REGION,
      ]),
      listOfQuickSightPrincipals: listOfQuickSightPrincipals,
    });

    for (const glueTable of Object.values(placeholderDataTables)) {
      new GlueDataTable(this, `GlueTable${glueTable.tableName}`, { // NOSONAR: This is for construct creation
        description: `Glue placeholder table for ${glueTable.tableName}`,
        database: glueDatabase.glueDB,
        tableName: `${glueTable.tableName}`,
        s3Bucket: athenaWorkGroup.athenaWorkGroupBucket,
        bucketPrefix: glueTable.s3Prefix,
        listOfQuickSightPrincipals: listOfQuickSightPrincipals,
        columns: glueTable.columns,
        dataFormat: DataFormat.PARQUET,
      });
    }

    const glueResourceLinkDatabase = new GlueDatabase(this, 'glueResourceLinkDatabase', {
      databaseName: RESOURCE_LINK_DATABASE_NAME,
    });

    /**
     * UUID generator
     */
    const uuidResourcesProps: UUIDResourcesProps = {
      solutionId: props.solutionId,
      solutionName: props.solutionName,
      solutionVersion: props.solutionVersion,
      solutionBucketName: props.solutionBucketName,
      logLevel: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
      runtime: LAMBDA_RUNTIME,
      logGroupRetentionPeriod: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
    };
    const uuidGenerator = new UUIDResources(this, 'UUIDGenerator', uuidResourcesProps);


    /**
     * Solution deployment bucket
     */

    const deploymentSourceBucket = Bucket.fromBucketAttributes(this, 'SolutionRegionalBucket', {
      bucketName: props.solutionBucketName + '-' + cdk.Aws.REGION,
    });

    /**
     * SSM Resources
     */

    const listSsmParameterARNs: string[] = [];
    const listDataSourceNames: string[] = ['vpcFlowLogs', 'cloudtrail', 'securityHub', 'appfabric'];

    listDataSourceNames.forEach((dataSourceName: string) => {
      const ssmParameter = new StringParameter(this, `SsmParameter${dataSourceName}`, {
        description: `SSM parameter to toggle the data source ${dataSourceName} in the Security Lake`,
        parameterName: `/solutions/securityInsights/${Aws.REGION}/${dataSourceName}`,
        stringValue: '{"status":"Disabled","queryWindowDuration":"7"}',
        simpleName: false,
      });
      listSsmParameterARNs.push(ssmParameter.parameterArn);
    });

     


    /**
     * Lambda backed custom resource to create LakeFormation Permissions
     */
    const createLakeFormationPermissionsRole = new Role(this, 'SetupLakeFormationPermissionsRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    const createLakeFormationPermissionsRolePolicy = new Policy(this, 'SetupLakeFormationPermissionsPolicy', {
      statements: [
        new PolicyStatement({
          sid: 'CreateLakeFormationPermissions',
          actions: permissions.CREATE_LAKE_FORMATION_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'GlueResourcesPermissions',
          actions: GLUE_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: [
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:catalog`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:database/${SECURITY_LAKE_DATABASE_NAME}`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:database/${mappings.findInMap(
              'SecurityLakeConfiguration',
              'ResourceLinkDatabase',
            )}`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:database/${SECURITY_LAKE_DATABASE_NAME}`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:table/${mappings.findInMap(
              'SecurityLakeConfiguration',
              'ResourceLinkDatabase',
            )}/*`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:table/${SECURITY_LAKE_DATABASE_NAME}/*`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${
              cdk.Aws.ACCOUNT_ID
            }:userDefinedFunction/${mappings.findInMap('SecurityLakeConfiguration', 'ResourceLinkDatabase')}/*`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:userDefinedFunction/${SECURITY_LAKE_DATABASE_NAME}/*`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${securityLakeAccountId.valueAsString}:catalog`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${securityLakeAccountId.valueAsString}:database/${SECURITY_LAKE_DATABASE_NAME}`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${securityLakeAccountId.valueAsString}:table/${SECURITY_LAKE_DATABASE_NAME}/*`,
            `arn:${cdk.Aws.PARTITION}:glue:${cdk.Aws.REGION}:${securityLakeAccountId.valueAsString}:userDefinedFunction/${SECURITY_LAKE_DATABASE_NAME}/*`,
          ],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: CREATE_LOG_GROUP_PERMISSIONS,
          resources: [LAMBDA_LOG_GROUP_ARN],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: XRAY_ACTIONS,
          resources: ['*'],
        }),
      ],
    });
    createLakeFormationPermissionsRolePolicy.attachToRole(createLakeFormationPermissionsRole);

    NagSuppressions.addResourceSuppressions(createLakeFormationPermissionsRolePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);

    /**
     * Lambda function to setup LakeFormationPermissions
     */

    const createLakeFormationPermissions: AwsLambdaFunction = new AwsLambdaFunction(this, 'CreateLakeFormationPermissions', {
      description: 'Lambda function to create LakeFormation Permissions',
      runtime: LAMBDA_RUNTIME,
      code: Code.fromBucket(
        deploymentSourceBucket,
        `${props.solutionName}/${props.solutionVersion}/createLakeFormationPermissions.zip`,
      ),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(LAMBDA_TIMEOUT_DURATION),
      memorySize: LAMBDA_MEMORY_SIZE,
      role: createLakeFormationPermissionsRole.withoutPolicyUpdates(),
      tracing: Tracing.ACTIVE,
      reservedConcurrentExecutions: 1,
      environment: {
        LOG_LEVEL: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
        REGION: cdk.Aws.REGION,
        SECURITY_LAKE_ACCOUNT_ID: securityLakeAccountId.valueAsString,
        CURRENT_ACCOUNT_ID: cdk.Aws.ACCOUNT_ID,
        SECURITY_LAKE_VPC_TABLE_NAME: SECURITY_LAKE_VPC_TABLE_NAME,
        SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME: SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME,
        SECURITY_LAKE_SECURITY_HUB_TABLE_NAME: SECURITY_LAKE_SECURITY_HUB_TABLE_NAME,
        SECURITY_LAKE_DATABASE_NAME: SECURITY_LAKE_DATABASE_NAME,
        SECURITY_LAKE_APP_FABRIC_TABLE_NAME: SECURITY_LAKE_APP_FABRIC_TABLE_NAME,
        RESOURCE_LINK_DATABASE_NAME: glueResourceLinkDatabase.glueDB.databaseName,
        QUICKSIGHT_SERVICE_ROLE: QUICKSIGHT_SERVICE_LINKED_ROLE,
        QUICKSIGHT_ADMIN_USER: QUICKSIGHT_PRINCIPAL_ARN,
        ROLLUP_REGION: Aws.REGION,
        DEFAULT_DATABASE_NAME: glueDatabase.glueDB.databaseName,
        DEFAULT_VPC_DATATABLE_NAME: DEFAULT_VPC_TABLE_NAME,
        DEFAULT_SECURITY_HUB_DATATABLE_NAME: DEFAULT_SECURITY_HUB_TABLE_NAME,
        DEFAULT_CLOUDTRAIL_DATATABLE_NAME: DEFAULT_CLOUDTRAIL_TABLE_NAME,
        LAMBDA_EXECUTION_ROLE_ARN: createLakeFormationPermissionsRole.roleArn,
        USER_AGENT_STRING: USER_AGENT_STRING,
        DELAY_IN_SECONDS_FOR_RATE_LIMITING: DELAY_IN_SECONDS_FOR_RATE_LIMITING,
        QUICKSIGHT_ADMIN_USER_GROUP_ARN: `arn:${cdk.Aws.PARTITION}:quicksight:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:group/default/${QUICKSIGHT_ADMIN_USER_GROUP_NAME}`,
        QUICKSIGHT_READ_USER_GROUP_ARN: `arn:${cdk.Aws.PARTITION}:quicksight:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:group/default/${QUICKSIGHT_READ_USER_GROUP_NAME}`,
        CREATE_USER_GROUPS: createQuickSightUserGroups.valueAsString,
      },
    });

    const createLakeFormationPermissionsLogGroup = new LogGroup(this, 'CreateLakeFormationPermissionsLogGroup', {
      logGroupName: `/aws/lambda/${createLakeFormationPermissions.functionName}`,
      retention: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    addCfnNagSuppression(createLakeFormationPermissionsLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });

    const createLakeFormationPermissionsCustomResource = new CustomResource(
      this,
      'CreateLakeFormationPermissionsCustomResource',
      {
        resourceType: 'Custom::CreateLakeFormationPermissions',
        serviceToken: createLakeFormationPermissions.functionArn,
        properties: {
          SecurityLakeAccount: securityLakeAccountId.valueAsString,
          AccountId: this.account,
          Region: this.region,
          QuickSightAdminArn: quickSightUserNameArn.valueAsString,
          CreateQuickSightUserGrous: createQuickSightUserGroups.valueAsString,
        },
      },
    );
    createLakeFormationPermissionsCustomResource.node.addDependency(createLakeFormationPermissionsLogGroup);
    createLakeFormationPermissionsCustomResource.node.addDependency(createLakeFormationPermissionsRolePolicy);


    /**
     * Lambda backed custom resource to create QuickSight datasets
     */

    const createQuickSightDataSetsRole = new Role(this, 'CreateQuickSightDataSetsRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const createQuickSightDataSetsRoleCreatePolicy = new Policy(this, 'CreateQuickSightDataSetsRoleCreatePolicy', {
      statements: [
        new PolicyStatement({
          sid: 'QuickSightDataSetPermissions',
          actions: QUICKSIGHT_DATASET_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: DATA_SET_ARNS,
        }),
        new PolicyStatement({
          sid: 'ListQuickSightIngestions',
          actions: QUICKSIGHT_LIST_INGESTION_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'QuickSightIngestionPermissions',
          actions: QUICKSIGHT_INGESTION_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: INGESTION_ARNS,
        }),
        new PolicyStatement({
          sid: 'QuickSightCreateDataSource',
          actions: permissions.QUICKSIGHT_DATASOURCE_CREATE_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'QuickSightDataSourcePermissions',
          actions: QUICKSIGHT_DATASOURCE_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: [
            `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:datasource/${mappings.findInMap(
              'QuickSightConfiguration',
              'QuickSightDataSourceId',
            )}`,
          ],
        }),
        new PolicyStatement({
          sid: 'AllowSSMAccess',
          actions: SSM_GET_PARAMETER_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: listSsmParameterARNs,
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: CREATE_LOG_GROUP_PERMISSIONS,
          resources: [LAMBDA_LOG_GROUP_ARN],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: XRAY_ACTIONS,
          resources: ['*'],
        }),
      ],
    });

    const createQuickSightDataSetsRoleUpdatePolicy = new Policy(this, 'CreateQuickSightDataSetsRoleUpdatePolicy', {
      statements: [
        new PolicyStatement({
          sid: 'QuickSightUpdateDataSetPermissionsForDataSource',
          actions: QUICKSIGHT_UPDATE_DATASET_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: [
            `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:datasource/${mappings.findInMap(
              'QuickSightConfiguration',
              'QuickSightDataSourceId',
            )}`,
          ],
        }),
      ],
    });

    createQuickSightDataSetsRoleCreatePolicy.attachToRole(createQuickSightDataSetsRole);
    createQuickSightDataSetsRoleUpdatePolicy.attachToRole(createQuickSightDataSetsRole);

    NagSuppressions.addResourceSuppressions(createQuickSightDataSetsRoleCreatePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);
    NagSuppressions.addResourceSuppressions(createQuickSightDataSetsRoleUpdatePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);

    const createQuickSightDataSets: AwsLambdaFunction = new AwsLambdaFunction(this, 'CreateQuickDataSets', {
      description: 'Lambda function to create data and update data sets for QuickSight',
      runtime: LAMBDA_RUNTIME,
      code: Code.fromBucket(
        deploymentSourceBucket,
        `${props.solutionName}/${props.solutionVersion}/createQuickSightDataSets.zip`,
      ),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(LAMBDA_TIMEOUT_DURATION),
      memorySize: LAMBDA_MEMORY_SIZE,
      role: createQuickSightDataSetsRole.withoutPolicyUpdates(),
      tracing: Tracing.ACTIVE,
      reservedConcurrentExecutions: 4,
      environment: {
        REGION: cdk.Aws.REGION,
        CURRENT_ACCOUNT_ID: cdk.Aws.ACCOUNT_ID,
        LOG_LEVEL: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
        USER_AGENT_STRING: USER_AGENT_STRING,
        QUICKSIGHT_PRINCIPAL_ARN: QUICKSIGHT_PRINCIPAL_ARN,
        ATHENA_WORKGROUP_NAME: athenaWorkGroup.athenaWorkGroupName,
        DATA_SOURCE_ARN: DATA_SOURCE_ARN,
        QUICKSIGHT_SERVICE_LINKED_ROLE: QUICKSIGHT_SERVICE_LINKED_ROLE,
        DEFAULT_DATABASE_NAME: glueDatabase.glueDB.databaseName,
        SECURITY_LAKE_DATABASE_NAME: SECURITY_LAKE_DATABASE_NAME,
        DEFAULT_VPC_DATATABLE_NAME: DEFAULT_VPC_TABLE_NAME,
        DEFAULT_SECURITY_HUB_DATATABLE_NAME: DEFAULT_SECURITY_HUB_TABLE_NAME,
        DEFAULT_CLOUDTRAIL_DATATABLE_NAME: DEFAULT_CLOUDTRAIL_TABLE_NAME,
        DEFAULT_APP_FABRIC_DATATABLE_NAME: DEFAULT_APP_FABRIC_TABLE_NAME,
        SECURITY_LAKE_VPC_TABLE_NAME: SECURITY_LAKE_VPC_TABLE_NAME,
        SECURITY_LAKE_SECURITY_HUB_TABLE_NAME: SECURITY_LAKE_SECURITY_HUB_TABLE_NAME,
        SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME: SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME,
        SECURITY_LAKE_APP_FABRIC_TABLE_NAME: SECURITY_LAKE_APP_FABRIC_TABLE_NAME,
        ROLLUP_REGION: Aws.REGION,
        DEFAULT_QUERY_WINDOW_DURATION: DEFAULT_QUERY_WINDOW_DURATION,
        RESOURCE_LINK_DATABASE_NAME: RESOURCE_LINK_DATABASE_NAME,
        SECURITY_LAKE_ACCOUNT_ID: securityLakeAccountId.valueAsString,
        DELAY_IN_SECONDS_FOR_RATE_LIMITING: DELAY_IN_SECONDS_FOR_RATE_LIMITING,
        SECURITY_HUB_SSM_PARAMETER_NAME: SECURITY_HUB_SSM_PARAMETER_NAME,
        CLOUDTRAIL_SSM_PARAMETER_NAME: CLOUDTRAIL_SSM_PARAMETER_NAME,
        VPC_FLOW_LOGS_SSM_PARAMETER_NAME: VPC_FLOW_LOGS_SSM_PARAMETER_NAME,
        APP_FABRIC_SSM_PARAMETER_NAME: APP_FABRIC_SSM_PARAMETER_NAME,
        DELAY_IN_SECONDS_FOR_DATA_SOURCE_CREATION: DELAY_IN_SECONDS_FOR_DATA_SOURCE_CREATION,
        DELAY_IN_SECONDS_FOR_DATA_SOURCE_UPDATE: DELAY_IN_SECONDS_FOR_DATA_SOURCE_UPDATE,
        METRICS_ENDPOINT: mappings.findInMap('SolutionConfiguration', 'MetricsURL'),
        SEND_METRIC: mappings.findInMap('SolutionConfiguration', 'SendAnonymizedUsageData'),
        SOLUTION_ID: mappings.findInMap('SolutionConfiguration', 'ID'),
        UUID: uuidGenerator.uuid,
        SOLUTION_VERSION: mappings.findInMap('SolutionConfiguration', 'Version')
      },
    });

    const createQuickSightDataSetLogGroup = new LogGroup(this, 'CreateQuickDataSetLogGroup', {
      logGroupName: `/aws/lambda/${createQuickSightDataSets.functionName}`,
      retention: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    addCfnNagSuppression(createQuickSightDataSetLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });

    const quickSightDataSetCreateCustomResource = new CustomResource(this, 'QuickSightDataSetCreator', {
      resourceType: 'Custom::CreateQuickSightDataSets',
      serviceToken: createQuickSightDataSets.functionArn,
      properties: {
        AccountId: this.account,
        Region: this.region,
        Version: mappings.findInMap('SolutionConfiguration', 'Version'),
      },
    });
    quickSightDataSetCreateCustomResource.node.addDependency(createQuickSightDataSetLogGroup);
    quickSightDataSetCreateCustomResource.node.addDependency(createQuickSightDataSetsRoleCreatePolicy);
    quickSightDataSetCreateCustomResource.node.addDependency(createQuickSightDataSetsRoleUpdatePolicy);
    quickSightDataSetCreateCustomResource.node.addDependency(athenaWorkGroup.athenaWorkGroup);
    quickSightDataSetCreateCustomResource.node.addDependency(createLakeFormationPermissionsCustomResource);


  /**
    *  EventBridge Resources
  */

  new EventbridgeToLambda(this, 'EventsRuleLambda', {// NOSONAR - This is for construct creation
    existingLambdaObj: createQuickSightDataSets,
    eventRuleProps: {
      eventPattern: {
        source: ['aws.ssm'],
        detailType: ['Parameter Store Change'],
        resources: listSsmParameterARNs,
      },
    },
  });

    const ssmParameterForUpdatePermissions = new StringParameter(this, 'ssmParameterForUpdatePermissions', {
      description: 'SSM parameter to update security lake permissions in the Security Lake',
      parameterName: `/solutions/securityInsights/${Aws.REGION}/updatePermissions`,
      stringValue: 'Version 1',
      simpleName: false,
    });

    new EventbridgeToLambda(this, 'UpdatePermissionsForTables', {// NOSONAR - This is for construct creation
      existingLambdaObj: createLakeFormationPermissions,
      eventRuleProps: {
        eventPattern: {
          source: ['aws.ssm'],
          detailType: ['Parameter Store Change'],
          resources: [ssmParameterForUpdatePermissions.parameterArn],
        },
      },
    });

    /**
     *  QuickSight Resources
     */

    const quickSightAnalysis = new CfnAnalysis(this, 'SecurityInsightsAnalysis', {
      analysisId: cdk.Fn.join('-', [
        mappings.findInMap('QuickSightConfiguration', 'QuickSightAnalysisId'),
        Aws.REGION,
      ]),
      awsAccountId: cdk.Aws.ACCOUNT_ID,
      name: cdk.Fn.join('-', [
        mappings.findInMap('QuickSightConfiguration', 'QuickSightAnalysisName'),
        Aws.REGION,
      ]),
      sourceEntity: {
        sourceTemplate: {
          arn: this.node.tryGetContext('quicksight_source_template_arn'),
          dataSetReferences: [
            {
              dataSetPlaceholder: 'Security_Insights_AppFabric_Suspicious_Logins',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Suspicious_Logins`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_AppFabric_IP_Address_Logins',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_IP_Address_Logins`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_AppFabric_Apps_Failed_Logins',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Apps_Failed_Logins`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_AppFabric_Logins_By_Applications',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Logins_By_Applications`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_Security_Hub_Dataset',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Dataset`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_Cloudtrail_Dataset',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Dataset`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_VPC_Flow_Dataset',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_VPC_Flow_Dataset`,
            }
          ],
        },
      },
      permissions: [
        {
          actions: QUICKSIGHT_ANALYSIS_ACTIONS,
          principal: QUICKSIGHT_PRINCIPAL_ARN,
        },
      ],
    });

    quickSightAnalysis.addDependency(quickSightDataSetCreateCustomResource.node.defaultChild as cdk.CfnResource);

    const quickSightDashboard = new CfnDashboard(this, 'SecurityInsightsDashboard', {
      name: cdk.Fn.join('-', [
        mappings.findInMap('QuickSightConfiguration', 'QuickSightDashboardId'),
        Aws.REGION,
      ]),
      dashboardId: cdk.Fn.join('-', [
        mappings.findInMap('QuickSightConfiguration', 'QuickSightDashboardId'),
        Aws.REGION,
      ]),
      awsAccountId: cdk.Aws.ACCOUNT_ID,
      dashboardPublishOptions: {
        adHocFilteringOption: {
          availabilityStatus: 'DISABLED',
        },
        exportToCsvOption: {
          availabilityStatus: 'ENABLED',
        },
        sheetControlsOption: {
          visibilityState: 'COLLAPSED',
        },
        sheetLayoutElementMaximizationOption: {
          availabilityStatus: 'ENABLED',
        },
        visualMenuOption: {
          availabilityStatus: 'ENABLED',
        },
        visualAxisSortOption: {
          availabilityStatus: 'ENABLED',
        },
        exportWithHiddenFieldsOption: {
          availabilityStatus: 'DISABLED',
        },
        dataPointDrillUpDownOption: {
          availabilityStatus: 'ENABLED',
        },
        dataPointMenuLabelOption: {
          availabilityStatus: 'ENABLED',
        },
        dataPointTooltipOption: {
          availabilityStatus: 'ENABLED',
        },
      },
      permissions: [
        {
          actions: QUICKSIGHT_DASHBOARD_ACTIONS,
          principal: QUICKSIGHT_PRINCIPAL_ARN,
        },
      ],
      sourceEntity: {
        sourceTemplate: {
          arn: this.node.tryGetContext('quicksight_source_template_arn'),
          dataSetReferences: [
            {
              dataSetPlaceholder: 'Security_Insights_AppFabric_Suspicious_Logins',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Suspicious_Logins`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_AppFabric_IP_Address_Logins',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_IP_Address_Logins`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_AppFabric_Apps_Failed_Logins',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Apps_Failed_Logins`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_AppFabric_Logins_By_Applications',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_AppFabric_Logins_By_Applications`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_Security_Hub_Dataset',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Dataset`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_Cloudtrail_Dataset',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Dataset`,
            },
            {
              dataSetPlaceholder: 'Security_Insights_VPC_Flow_Dataset',
              dataSetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_VPC_Flow_Dataset`,
            }
          ],
        },
      },
    });

    quickSightDashboard.addDependency(quickSightAnalysis);

    
    /**
     * Lambda backed custom resources to create and update refresh schedules for QuickSight DataSets
     */

    const createQuickSightDataSetRefreshSchedulesRole = new Role(this, 'CreateQuickSightDataSetRefreshSchedulesRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const createQuickSightDataSetRefreshSchedulesRolePolicy = new Policy(
      this,
      'CreateQuickSightDataSetRefreshSchedulesRolePolicy',
      {
        statements: [
          new PolicyStatement({
            sid: 'AllowQuickSightDataSetRefreshSchedules',
            actions: REFRESH_SCHEDULE_PERMISSIONS,
            effect: Effect.ALLOW,
            resources: REFRESH_SCHEDULE_ARNS,
          }),
          new PolicyStatement({
            sid: 'LamdaLogGroupPolicyStatement',
            effect: Effect.ALLOW,
            actions: CREATE_LOG_GROUP_PERMISSIONS,
            resources: [LAMBDA_LOG_GROUP_ARN],
          }),
          new PolicyStatement({
            sid: 'XrayPolicy',
            effect: Effect.ALLOW,
            actions: XRAY_ACTIONS,
            resources: ['*'],
          }),
        ],
      },
    );

    createQuickSightDataSetRefreshSchedulesRolePolicy.attachToRole(createQuickSightDataSetRefreshSchedulesRole);
    NagSuppressions.addResourceSuppressions(createQuickSightDataSetRefreshSchedulesRolePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);

    const createQuickSightDataSetRefreshSchedules: AwsLambdaFunction = new AwsLambdaFunction(
      this,
      'CreateQuickSightDataSetRefreshSchedules',
      {
        description: 'Lambda function to create refresh schedule for quicksight datasets',
        runtime: LAMBDA_RUNTIME,
        code: Code.fromBucket(
          deploymentSourceBucket,
          `${props.solutionName}/${props.solutionVersion}/createQuickSightDataSetRefreshSchedules.zip`,
        ),
        handler: 'index.handler',
        timeout: cdk.Duration.seconds(LAMBDA_TIMEOUT_DURATION),
        memorySize: LAMBDA_MEMORY_SIZE,
        role: createQuickSightDataSetRefreshSchedulesRole.withoutPolicyUpdates(),
        tracing: Tracing.ACTIVE,
        reservedConcurrentExecutions: 1,
        environment: {
          LOG_LEVEL: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
          USER_AGENT_STRING: USER_AGENT_STRING,
          REGION: cdk.Aws.REGION,
          QUICKSIGHT_PRINCIPAL_ARN: QUICKSIGHT_PRINCIPAL_ARN,
          ATHENA_WORKGROUP_NAME: athenaWorkGroup.athenaWorkGroupName,
          DATA_SOURCE_ARN: DATA_SOURCE_ARN,
          QUICKSIGHT_SERVICE_LINKED_ROLE: QUICKSIGHT_SERVICE_LINKED_ROLE,
          DEFAULT_DATABASE_NAME: glueDatabase.glueDB.databaseName,
          SECURITY_LAKE_DATABASE_NAME: SECURITY_LAKE_DATABASE_NAME,
          DEFAULT_VPC_DATATABLE_NAME: DEFAULT_VPC_TABLE_NAME,
          DEFAULT_SECURITY_HUB_DATATABLE_NAME: DEFAULT_SECURITY_HUB_TABLE_NAME,
          DEFAULT_CLOUDTRAIL_DATATABLE_NAME: DEFAULT_CLOUDTRAIL_TABLE_NAME,
          SECURITY_LAKE_VPC_TABLE_NAME: SECURITY_LAKE_VPC_TABLE_NAME,
          SECURITY_LAKE_SECURITY_HUB_TABLE_NAME: SECURITY_LAKE_SECURITY_HUB_TABLE_NAME,
          SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME: SECURITY_LAKE_CLOUDTRAIL_TABLE_NAME,
          ROLLUP_REGION: Aws.REGION,
          DEFAULT_QUERY_WINDOW_DURATION: DEFAULT_QUERY_WINDOW_DURATION,
          DELAY_IN_SECONDS_FOR_RATE_LIMITING: DELAY_IN_SECONDS_FOR_RATE_LIMITING,
        },
      },
    );

    const createQuickSightDataSetRefreshSchedulesLogGroup = new LogGroup(
      this,
      'CreateQuickSightDataSetRefreshSchedulesLogGroup',
      {
        logGroupName: `/aws/lambda/${createQuickSightDataSetRefreshSchedules.functionName}`,
        retention: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
        removalPolicy: RemovalPolicy.RETAIN,
      },
    );

    addCfnNagSuppression(createQuickSightDataSetRefreshSchedulesLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });

    const createQuickSightDataSetRefreshSchedulesCustomResource = new CustomResource(
      this,
      'createQuickSightDataSetRefreshSchedulesCustomResource',
      {
        resourceType: 'Custom::CreateQuickSightDataSetRefreshSchedules',
        serviceToken: createQuickSightDataSetRefreshSchedules.functionArn,
        properties: {
          AccountId: this.account,
          Region: this.region,
          Interval: frequency.valueAsString,
          DayOfWeek: mappings.findInMap('InputConfiguration', weeklyRefreshDay.valueAsString),
          DayOfMonth: monthlyRefreshDay.valueAsString,
          RefreshType: mappings.findInMap('QuickSightConfiguration', 'RefreshType'),
          Version: mappings.findInMap('SolutionConfiguration', 'Version'),
        },
      },
    );

    createQuickSightDataSetRefreshSchedulesCustomResource.node.addDependency(quickSightAnalysis);
    createQuickSightDataSetRefreshSchedulesCustomResource.node.addDependency(
      createQuickSightDataSetRefreshSchedulesLogGroup,
    );
    createQuickSightDataSetRefreshSchedulesCustomResource.node.addDependency(
      createQuickSightDataSetRefreshSchedulesRolePolicy,
    );
    createQuickSightDataSetRefreshSchedulesCustomResource.node.addDependency(
      quickSightDataSetCreateCustomResource,
    );
    createQuickSightDataSetRefreshSchedulesCustomResource.node.addDependency(
      createLakeFormationPermissionsCustomResource,
    );


    /**
     * Lambda for creating user groups
     */
    const quickSightUserGroupManagerRole = new Role(this, 'QuickSightUserGroupManagerRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    const quickSightUserGroupManagerRolePolicy = new Policy(this, 'QuickSightUserGroupManagerRolePolicy', {
      statements: [
        new PolicyStatement({
          sid: 'AllowCreateQuickSightUserGroup',
          actions: ['quicksight:CreateGroup', 'quicksight:DeleteGroup'],
          effect: Effect.ALLOW,
          resources: [
            `arn:aws:quicksight:*:${Aws.ACCOUNT_ID}:group/default/${QUICKSIGHT_ADMIN_USER_GROUP_NAME}`,
            `arn:aws:quicksight:*:${Aws.ACCOUNT_ID}:group/default/${QUICKSIGHT_READ_USER_GROUP_NAME}`,
          ],
        }),
        new PolicyStatement({
          sid: 'AllowUpdateQuickSightDashboardPermissions',
          actions: ['quicksight:UpdateDashboardPermissions'],
          effect: Effect.ALLOW,
          resources: [
            `arn:${Aws.PARTITION}:quicksight:*:${Aws.ACCOUNT_ID}:dashboard/${QUICKSIGHT_DASHBOARD_NAME}`,
          ],
        }),
        new PolicyStatement({
          sid: 'AllowUpdateQuickSightAnalysisPermissions',
          actions: ['quicksight:UpdateAnalysisPermissions'],
          effect: Effect.ALLOW,
          resources: [
            `arn:${Aws.PARTITION}:quicksight:*:${Aws.ACCOUNT_ID}:analysis/${QUICKSIGHT_ANALYSIS_NAME}`,
          ],
        }),
        new PolicyStatement({
          sid: 'XrayPolicy',
          actions: XRAY_ACTIONS,
          effect: Effect.ALLOW,
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'LamdaLogGroupPolicyStatement',
          effect: Effect.ALLOW,
          actions: CREATE_LOG_GROUP_PERMISSIONS,
          resources: [LAMBDA_LOG_GROUP_ARN],
        }),
      ],
    });
    quickSightUserGroupManagerRolePolicy.attachToRole(quickSightUserGroupManagerRole);
    NagSuppressions.addResourceSuppressions(quickSightUserGroupManagerRolePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);

    const quickSightUserGroupManager: AwsLambdaFunction = new AwsLambdaFunction(this, 'QuickSightUserGroupManager', {
      description:
        'Creates default user groups and assigns permissions to view the Security Insights Dashboard and Analyses',
      runtime: LAMBDA_RUNTIME,
      code: Code.fromBucket(
        deploymentSourceBucket,
        `${props.solutionName}/${props.solutionVersion}/quickSightUserGroupManager.zip`,
      ),
      handler: 'index.handler',
      memorySize: LAMBDA_MEMORY_SIZE,
      timeout: cdk.Duration.seconds(300),
      role: quickSightUserGroupManagerRole.withoutPolicyUpdates(),
      tracing: Tracing.ACTIVE,
      reservedConcurrentExecutions: 1,
      environment: {
        LOG_LEVEL: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
        ACCOUNT_ID: Aws.ACCOUNT_ID,
        QUICKSIGHT_ENDPOINT_REGION: QUICKSIGHT_ENDPOINT_REGION,
        USER_AGENT_STRING: USER_AGENT_STRING,
        SOLUTION_ID: mappings.findInMap('SolutionConfiguration', 'ID'),
        SOLUTION_VERSION: mappings.findInMap('SolutionConfiguration', 'Version'),
        QUICKSIGHT_ADMIN_USER_GROUP_NAME: QUICKSIGHT_ADMIN_USER_GROUP_NAME,
        QUICKSIGHT_READ_USER_GROUP_NAME: QUICKSIGHT_READ_USER_GROUP_NAME,
        REGION: Aws.REGION,
        QUICKSIGHT_PRINCIPAL_ARN: QUICKSIGHT_PRINCIPAL_ARN,
        DELAY_IN_SECONDS_FOR_RATE_LIMITING: DELAY_IN_SECONDS_FOR_RATE_LIMITING,
        QUICKSIGHT_ADMIN_REGION: cdk.Fn.select(3, cdk.Fn.split(':', quickSightUserNameArn.valueAsString)),
      },
    });

    const quickSightUserGroupManagerLogGroup = new LogGroup(this, 'QuickSightUserGroupManagerLogGroup', {
      logGroupName: `/aws/lambda/${quickSightUserGroupManager.functionName}`,
      retention: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    const quickSightUserGroupsCustomResource = new CustomResource(this, 'QuickSightUserGroups', {
      resourceType: 'Custom::QuickSightUserGroups',
      serviceToken: quickSightUserGroupManager.functionArn,
      properties: {
        Region: this.region,
        DashboardID: quickSightDashboard.dashboardId,
        AnalysisID: quickSightAnalysis.analysisId,
      },
    });
    quickSightUserGroupsCustomResource.node.addDependency(quickSightDashboard);
    quickSightUserGroupsCustomResource.node.addDependency(quickSightUserGroupManagerLogGroup);
    quickSightUserGroupsCustomResource.node.addDependency(quickSightUserGroupManagerRolePolicy);

    addCfnNagSuppression(quickSightUserGroupManagerLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });

    // Add conditions for resources related to QuickSight user Groups

    const quickSightUserGroupResources = [
      quickSightUserGroupManager,
      quickSightUserGroupManagerLogGroup,
      quickSightUserGroupsCustomResource,
      quickSightUserGroupManagerRolePolicy,
      quickSightUserGroupManagerRole,
    ];

    for (const resource of quickSightUserGroupResources) {
      setCondition(resource, createQuickSightUserGroupsCondition);
    }

    
    /**
     * @description kms construct to generate KMS-CMK with needed base policy
     */

    const kmsKey = new Key(this, 'MyKMSKey', {
      alias: 'alias/securityInsights/snsKey',
      enableKeyRotation: true,
    });

    const keyPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'kms:Decrypt',
        'kms:GenerateDataKey*',
      ],
      resources: ['*'],
      principals: [
        new ServicePrincipal('cloudwatch.amazonaws.com'),
        new ServicePrincipal('events.amazonaws.com'),
        new ServicePrincipal('ssm.amazonaws.com'),
      ],
    });

    kmsKey.addToResourcePolicy(keyPolicy);

    /**
     *  Lambda function to send athena metrics
     */

    const sendMetricsRole = new Role(this, 'SendMetricsRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const sendMetricsRolePolicy = new Policy(this, 'SendMetricsRolePolicy', {
      statements: [
        new PolicyStatement({
          sid: 'GetAthenaQueryExecutionMetrics',
          actions: ['athena:GetQueryExecution'],
          effect: Effect.ALLOW,
          resources: [
            `arn:aws:athena:${Aws.REGION}:${Aws.ACCOUNT_ID}:workgroup/${athenaWorkGroup.athenaWorkGroupName}`,
          ],
        }),
        new PolicyStatement({
          actions: ['kms:Encrypt', 'kms:CreateGrant'],
          resources: [kmsKey.keyArn],
          effect: Effect.ALLOW,
        }),
        new PolicyStatement({
          actions: ['kms:ListAliases'],
          resources: ['*'], // does not allow resource-level permissions
          effect: Effect.ALLOW,
        }),
        new PolicyStatement({
          actions: XRAY_ACTIONS,
          resources: ['*'], // does not allow resource-level permissions
          effect: Effect.ALLOW,
        }),
        new PolicyStatement({
          sid: 'LamdaLogGroupPolicyStatement',
          effect: Effect.ALLOW,
          actions: CREATE_LOG_GROUP_PERMISSIONS,
          resources: [LAMBDA_LOG_GROUP_ARN],
        }),
        new PolicyStatement({
          sid: 'SSMParameterPolicyStatement',
          effect: Effect.ALLOW,
          actions: SSM_GET_PARAMETER_PERMISSIONS,
          resources: listSsmParameterARNs,
        }),
      ],
    });
    sendMetricsRolePolicy.attachToRole(sendMetricsRole);
    NagSuppressions.addResourceSuppressions(sendMetricsRolePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);

    const sendMetrics: AwsLambdaFunction = new AwsLambdaFunction(this, 'SendMetrics', {
      description: 'Lambda function to send athena metrics',
      runtime: LAMBDA_RUNTIME,
      timeout: cdk.Duration.seconds(SEND_METRICS_LAMBDA_TIMEOUT_DURATION),
      code: Code.fromBucket(
        deploymentSourceBucket,
        `${props.solutionName}/${props.solutionVersion}/sendMetrics.zip`,
      ),
      handler: 'index.handler',
      memorySize: LAMBDA_MEMORY_SIZE,
      tracing: Tracing.ACTIVE,
      role: sendMetricsRole.withoutPolicyUpdates(),
      reservedConcurrentExecutions: 5,
      environment: {
        METRICS_ENDPOINT: mappings.findInMap('SolutionConfiguration', 'MetricsURL'),
        SEND_METRIC: mappings.findInMap('SolutionConfiguration', 'SendAnonymizedUsageData'),
        LOG_LEVEL: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
        USER_AGENT_STRING: USER_AGENT_STRING,
        ATHENA_WORKGROUP: athenaWorkGroup.athenaWorkGroupName,
        SOLUTION_ID: mappings.findInMap('SolutionConfiguration', 'ID'),
        UUID: uuidGenerator.uuid,
        SOLUTION_VERSION: mappings.findInMap('SolutionConfiguration', 'Version'),
        INPUT_PARAMETER_FREQUENCY: frequency.valueAsString,
        INPUT_PARAMETER_WEEKLY_REFRESH_DAY: weeklyRefreshDay.valueAsString,
        INPUT_PARAMETER_MONTHLY_REFRESH_DAY: monthlyRefreshDay.valueAsString,
        INPUT_PARAMETER_LOG_LEVEL: logLevel.valueAsString,
        INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM: thresholdValueForAthenaAlarm.valueAsString,
        INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM: thresholdUnitForAthenaAlarm.valueAsString,
        INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS: createQuickSightUserGroups.valueAsString,
        INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS: createQuickSightQTopics.valueAsString,
        INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION: createSolutionReleaseNotification.valueAsString
      },
    });

    const sendMetricsLogGroup = new LogGroup(this, 'SendMetricsLogGroup', { // NOSONAR - Construct initialization
      logGroupName: `/aws/lambda/${sendMetrics.functionName}`,
      retention: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    addCfnNagSuppression(sendMetricsLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });

    const sendMetricsCustomResource = new CustomResource(
      this,
      'SendMetricsCustomResource',
      {
        resourceType: 'Custom::SendMetricsCustomResource',
        serviceToken: sendMetrics.functionArn,
        properties: {
          AccountId: this.account,
          Region: this.region,
          INPUT_PARAMETER_FREQUENCY: frequency.valueAsString,
          INPUT_PARAMETER_WEEKLY_REFRESH_DAY: weeklyRefreshDay.valueAsString,
          INPUT_PARAMETER_MONTHLY_REFRESH_DAY: monthlyRefreshDay.valueAsString,
          INPUT_PARAMETER_LOG_LEVEL: logLevel.valueAsString,
          INPUT_PARAMETER_THRESHOLD_VALUE_FOR_ATHENA_ALARM: thresholdValueForAthenaAlarm.valueAsString,
          INPUT_PARAMETER_THRESHOLD_UNIT_FOR_ATHENA_ALARM: thresholdUnitForAthenaAlarm.valueAsString,
          INPUT_PARAMETER_CREATE_QUICKSIGHT_USER_GROUPS: createQuickSightUserGroups.valueAsString,
          INPUT_PARAMETER_CREATE_QUICKSIGHT_Q_TOPICS: createQuickSightQTopics.valueAsString,
          INPUT_PARAMETER_CREATE_SOLUTION_RELEASE_NOTIFICATION: createSolutionReleaseNotification.valueAsString
        },
      },
    );
    sendMetricsCustomResource.node.addDependency(sendMetricsLogGroup);
    sendMetricsCustomResource.node.addDependency(sendMetricsRolePolicy);

    new EventbridgeToLambda(this, 'SSMParameterMetricsRule', {// NOSONAR - This is for construct creation
      existingLambdaObj: sendMetrics,
      eventRuleProps: {
        eventPattern: {
          source: ['aws.ssm'],
          detailType: ['Parameter Store Change'],
          resources: listSsmParameterARNs,
        },
      },
    });

    /**
     *  SNS Resources
     */

    const athenaExecutionNotificationsTopic = new SNS.Topic(this, 'AthenaExecutionNotificationsTopic', {
      topicName: 'SecurityInsightsnNotificationsTopic' + Aws.REGION,
      displayName: 'Notifications from Security Insights on AWS solution',
      masterKey: kmsKey,
    });
    athenaExecutionNotificationsTopic.grantPublish(new ServicePrincipal('events.amazonaws.com'));
    athenaExecutionNotificationsTopic.grantPublish(new ServicePrincipal('cloudwatch.amazonaws.com'));
    athenaExecutionNotificationsTopic.grantPublish(new ServicePrincipal('ssm.amazonaws.com'));

    athenaExecutionNotificationsTopic;
    if (emailID.valueAsString != '') {
      athenaExecutionNotificationsTopic.addSubscription(
        new EmailSubscription(emailID.valueAsString),
      );
    }

    const athenaExecutionEventRule = new Rule(this, 'AthenaExecutionEventRule', {
      eventPattern: {
        source: ['aws.athena'],
        detailType: ['Athena Query State Change'],
        detail: {
          workgroupName: [athenaWorkGroup.athenaWorkGroupName],
          currentState: ['FAILED'],
        },
      },
    });

    athenaExecutionEventRule.addTarget(new SnsTopic(athenaExecutionNotificationsTopic));


    const athenaMetricsEventRule = new Rule(this, 'AthenaMetricsEventRule', {
      eventPattern: {
        source: ['aws.athena'],
        detailType: ['Athena Query State Change'],
        detail: {
          workgroupName: [athenaWorkGroup.athenaWorkGroupName],
          currentState: ['SUCCEEDED'],
        },
      },
    });

    athenaMetricsEventRule.addTarget(new LambdaFunction(sendMetrics));

    /**
     * Lambda function to convert input threshold value to bytes
     */
    const convertAthenaThresholdValueToBytesRole = new Role(this, 'ConvertAthenaThresholdValueToBytesRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    const convertAthenaThresholdValueToBytesRolePolicy = new Policy(this, 'ConvertAthenaThresholdValueToBytesRolePolicy', {
      statements: [
        new PolicyStatement({
          actions: XRAY_ACTIONS,
          resources: ['*'], // does not allow resource-level permissions
          effect: Effect.ALLOW,
        }),
        new PolicyStatement({
          sid: 'LamdaLogGroupPolicyStatement',
          effect: Effect.ALLOW,
          actions: CREATE_LOG_GROUP_PERMISSIONS,
          resources: [LAMBDA_LOG_GROUP_ARN],
        }),
      ],
    });
    convertAthenaThresholdValueToBytesRolePolicy.attachToRole(convertAthenaThresholdValueToBytesRole);
    NagSuppressions.addResourceSuppressions(convertAthenaThresholdValueToBytesRolePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);
    const convertAthenaThresholdValueToBytes: AwsLambdaFunction = new AwsLambdaFunction(this, 'ConvertAthenaThresholdValueToBytes', {
      description: 'Lambda function to convert Athena threshold value to bytes',
      runtime: LAMBDA_RUNTIME,
      code: Code.fromBucket(
        deploymentSourceBucket,
        `${props.solutionName}/${props.solutionVersion}/setAthenaThresholdValue.zip`,
      ),
      role: convertAthenaThresholdValueToBytesRole.withoutPolicyUpdates(),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(LAMBDA_TIMEOUT_DURATION),
      memorySize: LAMBDA_MEMORY_SIZE,
      tracing: Tracing.ACTIVE,
      reservedConcurrentExecutions: 1,
      environment: {
        LOG_LEVEL: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
        USER_AGENT_STRING: USER_AGENT_STRING,
      },
    });

    const convertAthenaThresholdValueToBytesLogGroup = new LogGroup(
      this,
      'ConvertAthenaThresholdValueToBytesLogGroup',
      {
        logGroupName: `/aws/lambda/${convertAthenaThresholdValueToBytes.functionName}`,
        retention: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
        removalPolicy: RemovalPolicy.RETAIN,
      },
    );

    addCfnNagSuppression(convertAthenaThresholdValueToBytesLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });

    const convertAthenaThresholdValueToBytesCustomResource = new CustomResource(
      this,
      'convertAthenaThresholdValueToBytesCustomResource',
      {
        resourceType: 'Custom::ConvertAthenaThresholdValueToBytes',
        serviceToken: convertAthenaThresholdValueToBytes.functionArn,
        properties: {
          AccountId: this.account,
          Region: this.region,
          ThresholdValue: thresholdValueForAthenaAlarm,
          ThresholdUnit: thresholdUnitForAthenaAlarm,
        },
      },
    );
    convertAthenaThresholdValueToBytesCustomResource.node.addDependency(convertAthenaThresholdValueToBytesLogGroup);
    convertAthenaThresholdValueToBytesCustomResource.node.addDependency(convertAthenaThresholdValueToBytesRolePolicy);


    const athenaAlarmForDataScanned = new Alarm(this, 'AthenaAlarmForDataScanned', {
      datapointsToAlarm: DATA_POINTS_FOR_ATHENA_ALARM,
      evaluationPeriods: EVALUATION_PERIOD_FOR_ATHENA_ALARM,
      threshold: convertAthenaThresholdValueToBytesCustomResource.getAtt('ThresholdValueInBytes') as unknown as number,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
      actionsEnabled: true,
      metric: new Metric({
        namespace: 'AWS/Athena',
        metricName: 'ProcessedBytes',
        statistic: 'Sum',
        dimensionsMap: { WorkGroup: athenaWorkGroup.athenaWorkGroupName },
        period: Duration.days(EVALUATION_PERIOD_FOR_ATHENA_ALARM),
      }),
    });
    athenaAlarmForDataScanned.node.addDependency(athenaExecutionNotificationsTopic);
    athenaAlarmForDataScanned.addAlarmAction(new SnsAction(athenaExecutionNotificationsTopic));

    const {cloudTrailTopic, securityHubTopic} = this.createQForQuicksightTopics(createQuickSightDataSetRefreshSchedulesCustomResource, createQuickSightQTopicsCondition);

    /**
     * Lambda function to create new solution version release notifications
     */
    const createSolutionReleaseNotificationRole = new Role(this, 'CreateSolutionReleaseNotificationRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    const createSolutionReleaseNotificationRolePolicy = new Policy(this, 'CreateSolutionReleaseNotificationRolePolicy', {
      statements: [
        new PolicyStatement({
          sid: 'createOpsItems',
          actions: permissions.CREATE_DESCRIBE_OPS_ITEMS,
          effect: Effect.ALLOW,
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'updateOpsItems',
          actions: permissions.UPDATE_OPS_ITEMS,
          effect: Effect.ALLOW,
          resources: [`arn:${cdk.Aws.PARTITION}:ssm:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:opsitem/*`],

        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: CREATE_LOG_GROUP_PERMISSIONS,
          resources: [LAMBDA_LOG_GROUP_ARN],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: XRAY_ACTIONS,
          resources: ['*'],
        }),
      ],
    });
    createSolutionReleaseNotificationRolePolicy.attachToRole(createSolutionReleaseNotificationRole);

    NagSuppressions.addResourceSuppressions(createSolutionReleaseNotificationRolePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);

    /**
     * Lambda function resources to create notifications for new solution version releases
     */

    const createSolutionReleaseNotificationFunction: AwsLambdaFunction = new AwsLambdaFunction(this, 'CreateSolutionReleaseNotificationFunction', {
      description: 'Lambda function to create new release notifications',
      runtime: LAMBDA_RUNTIME,
      code: Code.fromBucket(
        deploymentSourceBucket,
        `${props.solutionName}/${props.solutionVersion}/createSolutionReleaseNotification.zip`,
      ),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(LAMBDA_TIMEOUT_DURATION),
      memorySize: LAMBDA_MEMORY_SIZE,
      role: createSolutionReleaseNotificationRole.withoutPolicyUpdates(),
      tracing: Tracing.ACTIVE,
      reservedConcurrentExecutions: 1,
      environment: {
        LOG_LEVEL: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
        REGION: cdk.Aws.REGION,
        LAMBDA_EXECUTION_ROLE_ARN: createLakeFormationPermissionsRole.roleArn,
        USER_AGENT_STRING: USER_AGENT_STRING,
        DELAY_IN_SECONDS_FOR_RATE_LIMITING: DELAY_IN_SECONDS_FOR_RATE_LIMITING,
        CURRENT_RELEASE_TAG: `release/${props.solutionVersion}`,
        SOLUTION_GIT_REPO_URL: mappings.findInMap('SolutionConfiguration', 'GitHubRepoUrl'),
        SNS_TOPIC_ARN: athenaExecutionNotificationsTopic.topicArn,
        CREATE_QUICKSIGHT_DATASETS_LAMBDA_FUNCTION_ARN: createQuickSightDataSets.functionArn,

      },
    });
    setCondition(createSolutionReleaseNotificationFunction, createSolutionReleaseNotificationCondition);

    const opsItemStatusChangeEventRule = new Rule(this, 'OpsItemStatusChangeRule', {
      description: 'Triggers the sendMetrics Lambda function when the Solution Release Ops Item status changes',
      eventPattern: {
        source: ['aws.ssm'],
        detailType: ['OpsItem Update', 'OpsItem Create'],
        detail: {
          status: ['Open', 'Resolved'],
          source: ['GitHub/AWS-Solutions'],
        },
      },
    });
    opsItemStatusChangeEventRule.addTarget(new events_targets.LambdaFunction(sendMetrics));

    const createSolutionReleaseNotificationFunctionLogGroup = new LogGroup(this, 'CreateSolutionReleaseNotificationFunctionLogGroup', {
      logGroupName: `/aws/lambda/${createSolutionReleaseNotificationFunction.functionName}`,
      retention: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    setCondition(createSolutionReleaseNotificationFunctionLogGroup, createSolutionReleaseNotificationCondition);


    addCfnNagSuppression(createSolutionReleaseNotificationFunctionLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });

    //Event schedule for Release Notification Lambda

    const createReleaseNotificationSchedulerRole = new Role(this, 'CreateReleaseNotificationSchedulerRole', {
      assumedBy: new ServicePrincipal('scheduler.amazonaws.com'),
    }).withoutPolicyUpdates();
    setCondition(createReleaseNotificationSchedulerRole, createSolutionReleaseNotificationCondition);


    const createReleaseNotificationSchedulerRolePolicy = new Policy(this, 'CreateReleaseNotificationSchedulerRolePolicy', {
      statements: [
        new PolicyStatement({
          sid: 'InvokeLambda',
          actions: ['lambda:InvokeFunction'],
          effect: Effect.ALLOW,
          resources: [createSolutionReleaseNotificationFunction.functionArn],
        }),
      ],
    });
    createReleaseNotificationSchedulerRolePolicy.attachToRole(createReleaseNotificationSchedulerRole);
    setCondition(createReleaseNotificationSchedulerRolePolicy, createSolutionReleaseNotificationCondition);

    NagSuppressions.addResourceSuppressions(createLakeFormationPermissionsRolePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);

    const target = new targets.LambdaInvoke(createSolutionReleaseNotificationFunction, {
      role: createReleaseNotificationSchedulerRole,
    });

    const releaseNotificationSchedule = new schedule.Schedule(this, 'ReleaseNotificationSchedule', {
      schedule: schedule.ScheduleExpression.rate(Duration.hours(72)),
      timeWindow: schedule.TimeWindow.flexible(Duration.hours(10)),
      target: target,
    });
    setCondition(releaseNotificationSchedule, createSolutionReleaseNotificationCondition);

    /**
     * Lambda based custom resource to update SSM parameters during the solution version upgrade
     */

    const updateSSMParameterPermissionsRole = new Role(this, 'UpdateSSMParameterPermissionsRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    setCondition(updateSSMParameterPermissionsRole, createQuickSightQTopicsCondition);

    const updateSSMParameterPermissionsRolePolicy = new Policy(this, 'UpdateSSMParameterPermissionsRolePolicy', {
      statements: [
        new PolicyStatement({
          sid: 'GetSSMParameter',
          actions: permissions.SSM_GET_PARAMETER_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: listSsmParameterARNs,
        }),
        new PolicyStatement({
          sid: 'PutSSMParameter',
          actions: permissions.SSM_UPDATE_PARAMETER_PERMISSIONS,
          effect: Effect.ALLOW,
          resources: listSsmParameterARNs,
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: CREATE_LOG_GROUP_PERMISSIONS,
          resources: [LAMBDA_LOG_GROUP_ARN],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: XRAY_ACTIONS,
          resources: ['*'],
        }),
      ],
    });
    updateSSMParameterPermissionsRolePolicy.attachToRole(updateSSMParameterPermissionsRole);
    setCondition(updateSSMParameterPermissionsRolePolicy, createQuickSightQTopicsCondition);

    NagSuppressions.addResourceSuppressions(updateSSMParameterPermissionsRolePolicy, [
      {
        id: 'AwsSolutions-IAM5',
        reason:
          'All policies have been scoped to be as restrictive as possible. The create actions only support * as resource',
      },
    ]);

    /**
     * Lambda function to update SSM parameters
     */

    const updateSSMParametersFunction: AwsLambdaFunction = new AwsLambdaFunction(this, 'UpdateSSMParametersFunction', {
      description: 'Lambda function to update SSM Parameters',
      runtime: LAMBDA_RUNTIME,
      code: Code.fromBucket(
        deploymentSourceBucket,
        `${props.solutionName}/${props.solutionVersion}/updateSsmParameters.zip`,
      ),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(LAMBDA_TIMEOUT_DURATION),
      memorySize: LAMBDA_MEMORY_SIZE,
      role: updateSSMParameterPermissionsRole.withoutPolicyUpdates(),
      tracing: Tracing.ACTIVE,
      reservedConcurrentExecutions: 1,
      environment: {
        LOG_LEVEL: mappings.findInMap('InputConfiguration', logLevel.valueAsString),
        REGION: cdk.Aws.REGION,
        USER_AGENT_STRING: USER_AGENT_STRING,
        DELAY_IN_SECONDS_FOR_RATE_LIMITING: DELAY_IN_SECONDS_FOR_RATE_LIMITING,
        SECURITY_HUB_SSM_PARAMETER_NAME: SECURITY_HUB_SSM_PARAMETER_NAME,
        CLOUDTRAIL_SSM_PARAMETER_NAME: CLOUDTRAIL_SSM_PARAMETER_NAME,
        VPC_FLOW_LOGS_SSM_PARAMETER_NAME: VPC_FLOW_LOGS_SSM_PARAMETER_NAME,
        APP_FABRIC_SSM_PARAMETER_NAME: APP_FABRIC_SSM_PARAMETER_NAME
      },
    });
    setCondition(updateSSMParametersFunction, createQuickSightQTopicsCondition);

    const updateSSMParametersLogGroup = new LogGroup(this, 'UpdateSSMParametersLogGroup', {
      logGroupName: `/aws/lambda/${updateSSMParametersFunction.functionName}`,
      retention: LAMBDA_LOG_GROUP_RETENTION_PERIOD,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    setCondition(updateSSMParametersLogGroup, createQuickSightQTopicsCondition);

    addCfnNagSuppression(updateSSMParametersLogGroup, {
      id: 'W84',
      reason: 'CloudWatch log group is always encrypted by default.',
    });

    const updateSSMParametersCustomResource = new CustomResource(
      this,
      'UpdateSSMParametersCustomResource',
      {
        resourceType: 'Custom::UpdateSSMParameters',
        serviceToken: updateSSMParametersFunction.functionArn,
        properties: {
          Version: mappings.findInMap('SolutionConfiguration', 'Version'),
          Region: Aws.REGION
        },
      },
    );
    updateSSMParametersCustomResource.node.addDependency(createLakeFormationPermissionsLogGroup);
    createLakeFormationPermissionsCustomResource.node.addDependency(createLakeFormationPermissionsRolePolicy);

    updateSSMParametersCustomResource.node.addDependency(updateSSMParametersLogGroup)
    updateSSMParametersCustomResource.node.addDependency(updateSSMParameterPermissionsRolePolicy)
    updateSSMParametersCustomResource.node.addDependency(securityHubTopic)
    updateSSMParametersCustomResource.node.addDependency(cloudTrailTopic)
    setCondition(updateSSMParametersCustomResource, createQuickSightQTopicsCondition);

    


    // Outputs

    new CfnOutput(this, 'SendAnonymizedDataOutput', {
      value: mappings.findInMap('SolutionConfiguration', 'SendAnonymizedUsageData'),
      exportName: cdk.Fn.join('-', ['SendAnonymizedData', Aws.REGION]),
    }).overrideLogicalId('SendAnonymizedData');

    new CfnOutput(this, 'SolutionIDOutput', {
      value: mappings.findInMap('SolutionConfiguration', 'ID'),
      exportName: cdk.Fn.join('-', ['SolutionID', Aws.REGION]),
    }).overrideLogicalId('SolutionID');

    new CfnOutput(this, 'SolutionVersionOutput', {
      value: mappings.findInMap('SolutionConfiguration', 'Version'),
      exportName: cdk.Fn.join('-', ['SolutionVersion', Aws.REGION]),
    }).overrideLogicalId('SolutionVersion');

    new CfnOutput(this, 'SecurityHubSSMParameterUrl', { //NOSONAR - The output is needed to access SSM parameter
      description: 'Url to access SecurityHub SSM Parameter',
      value: cdk.Fn.join('', [
        'https://',
        Aws.REGION,
        '.console.aws.amazon.com/systems-manager/parameters/solutions/securityInsights/',
        Aws.REGION,
        '/securityHub/',
      ]),
    });

    new CfnOutput(this, 'CloudtrailSSMParameterUrl', { //NOSONAR - The output is needed to access SSM parameter
      description: 'Url to access Cloudtrail SSM Parameter',
      value: cdk.Fn.join('', [
        'https://',
        Aws.REGION,
        '.console.aws.amazon.com/systems-manager/parameters/solutions/securityInsights/',
        Aws.REGION,
        '/cloudtrail/',
      ]),
    });

    new CfnOutput(this, 'VpcFlowLogsSSMParameterUrl', { //NOSONAR - The output is needed to access SSM parameter
      description: 'Url to access VpcFlowLogs SSM Parameter',
      value: cdk.Fn.join('', [
        'https://',
        Aws.REGION,
        '.console.aws.amazon.com/systems-manager/parameters/solutions/securityInsights/',
        Aws.REGION,
        '/vpcFlowLogs/',
      ]),
    });

    new CfnOutput(this, 'AppFabricSSMParameterUrl', { //NOSONAR - The output is needed to access SSM parameter
      description: 'Url to access AppFabric SSM Parameter',
      value: cdk.Fn.join('', [
        'https://',
        Aws.REGION,
        '.console.aws.amazon.com/systems-manager/parameters/solutions/securityInsights/',
        Aws.REGION,
        '/appfabric/',
      ]),
    });

    new CfnOutput(this, 'UpdatePermissionsSSMParameterUrl', { //NOSONAR - The output is needed to access SSM parameter
      description: 'Url to access UpdatePermissions SSM Parameter',
      value: cdk.Fn.join('', [
        'https://',
        Aws.REGION,
        '.console.aws.amazon.com/systems-manager/parameters/solutions/securityInsights/',
        Aws.REGION,
        '/updatePermissions/',
      ]),
    });
    addCfnNagSuppression(createQuickSightDataSets, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC'
    });

    NagSuppressions.addResourceSuppressions(createQuickSightDataSets, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);

    addCfnNagSuppression(createLakeFormationPermissions, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC',
    });

    NagSuppressions.addResourceSuppressions(createLakeFormationPermissions, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);

    addCfnNagSuppression(createQuickSightDataSetRefreshSchedules, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC',
    });

    NagSuppressions.addResourceSuppressions(createQuickSightDataSetRefreshSchedules, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);

    addCfnNagSuppression(createSolutionReleaseNotificationFunction, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC',
    });

    NagSuppressions.addResourceSuppressions(createSolutionReleaseNotificationFunction, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);

    addCfnNagSuppression(quickSightUserGroupManager, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC',
    });

    NagSuppressions.addResourceSuppressions(quickSightUserGroupManager, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);

    addCfnNagSuppression(sendMetrics, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC',
    });

    NagSuppressions.addResourceSuppressions(sendMetrics, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);

    addCfnNagSuppression(updateSSMParametersFunction, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC',
    });

    NagSuppressions.addResourceSuppressions(updateSSMParametersFunction, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);

    addCfnNagSuppression(convertAthenaThresholdValueToBytes, {
      id: 'W89',
      reason: 'The lambda function does not need access to resources in VPC',
    });

    NagSuppressions.addResourceSuppressions(convertAthenaThresholdValueToBytes, [
      {
        id: 'AwsSolutions-L1',
        reason: 'Node.js 20.x is the latest stable LTS version supported by this CDK version',
      },
    ]);
  }

  private createQForQuicksightTopics(
    createQuickSightDataSetRefreshSchedulesCustomResource: CustomResource,
    createQForQuicksightTopics: CfnCondition,
  ) {
    // Amazon Q CloudTrail Topic
    const cloudTrailTopic = new CfnTopic(this, 'CloudTrailTopic', {
      name: 'SecurityInsights-CloudTrailTopic',
      description: 'This is a topic for CloudTrail data source',
      awsAccountId: Aws.ACCOUNT_ID,
      topicId: 'SecurityInsights-CloudTrailTopic',
      userExperienceVersion: 'NEW_READER_EXPERIENCE',
      dataSets: [
        {
          datasetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Cloudtrail_Dataset`,
          datasetName: 'Security_Insights_Cloudtrail_Dataset',
          columns: [
            {
              columnName: 'Record_Id',
              columnFriendlyName: 'Record',
              columnDescription: '',
              columnSynonyms: [
                'Event',
                'document',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              semanticType: {
                typeName: 'Identifier',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Product_Name',
              columnFriendlyName: 'Product Name',
              columnDescription: '',
              columnSynonyms: [
                'software name',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              semanticType: {
                typeName: 'Organization',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Timestamp',
              columnFriendlyName: 'Timestamp',
              columnDescription: '',
              columnSynonyms: [
                'date',
                'time',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Date',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Event_Code',
              columnFriendlyName: 'Event Code',
              columnDescription: '',
              columnSynonyms: [
                'activity code',
                'action code',
                'incident code',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Api_Operation',
              columnFriendlyName: 'Api Operation',
              columnDescription: '',
              columnSynonyms: [
                'api',
                'operation',
                'api call',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Cloud_Provider',
              columnFriendlyName: 'Cloud Provider',
              columnDescription: '',
              columnSynonyms: [
                'cloud supplier',
                'cloud vendor',
                'cloud company',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              semanticType: {
                typeName: 'Organization',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Service',
              columnFriendlyName: 'Service',
              columnDescription: '',
              columnSynonyms: [
                'provision',
                'support',
                'system',
                'aws service',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Actor_User_Type',
              columnFriendlyName: 'Actor User Type',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Actor_User_Name',
              columnFriendlyName: 'Actor User Name',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Actor_UId',
              columnFriendlyName: 'Actor UId',
              columnDescription: '',
              columnSynonyms: [
                'a u id',
                'performer u id',
                'agent u id',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'User_Name',
              columnFriendlyName: 'User Name',
              columnDescription: '',
              columnSynonyms: [
                'client name',
                'customer name',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'User_UId',
              columnFriendlyName: 'User UId',
              columnDescription: '',
              columnSynonyms: [
                'subscriber',
                'client',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Is_Cross_Account',
              columnFriendlyName: 'Is Cross Account',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'User_Agent',
              columnFriendlyName: 'User Agent',
              columnDescription: '',
              columnSynonyms: [
                'client agent',
                'employee agent',
                'owner agent',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Source_IP',
              columnFriendlyName: 'Source IP',
              columnDescription: '',
              columnSynonyms: [
                'ip',
                'ip address',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'MFA_Used',
              columnFriendlyName: 'MFA Used',
              columnDescription: '',
              columnSynonyms: [
                'mfa utilised',
              ],
              columnDataRole: 'MEASURE',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Class',
              columnFriendlyName: 'Class',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Category',
              columnFriendlyName: 'Category',
              columnDescription: '',
              columnSynonyms: [
                'classification',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Activity',
              columnFriendlyName: 'Activity',
              columnDescription: '',
              columnSynonyms: [
                'action',
                'operation',
                'occurrence',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Type',
              columnFriendlyName: 'Type',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Severity',
              columnFriendlyName: 'Severity',
              columnDescription: '',
              columnSynonyms: [
                'seriousness',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Status',
              columnFriendlyName: 'Status',
              columnDescription: '',
              columnSynonyms: [
                'situation',
                'result',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Account_Id',
              columnFriendlyName: 'Account Id',
              columnDescription: '',
              columnSynonyms: [
                'acount',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Identifier',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Region',
              columnFriendlyName: 'Region',
              columnDescription: '',
              columnSynonyms: [
                'area',
                'territory',
                'geography',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Location',
                subTypeName: 'Level200',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Email_Address',
              columnFriendlyName: 'Email Address',
              columnDescription: '',
              columnSynonyms: [
                'email',
                'email id',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Geo_Location',
              columnFriendlyName: 'Geo Location',
              columnDescription: '',
              columnSynonyms: [
                'geographic region',
                'geographic location',
                'geography location',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
          ],
          calculatedFields: [
            {
              calculatedFieldName: 'Username',
              calculatedFieldDescription: '',
              expression: 'coalesce({User_Name},{Actor_User_Name})',
              calculatedFieldSynonyms: [
                'actor name',
                'actor',
              ],
              isIncludedInTopic: true,
              columnDataRole: 'DIMENSION',
              neverAggregateInFilter: false,
            },
            {
              calculatedFieldName: 'UId',
              calculatedFieldDescription: '',
              expression: 'coalesce({Actor_UId},{User_UId})',
              calculatedFieldSynonyms: [
                'arn',
                'user arn',
                'unique id',
                'userarn',
                'actor',
              ],
              isIncludedInTopic: true,
              columnDataRole: 'DIMENSION',
              neverAggregateInFilter: false,
            },
          ],
          namedEntities: [
            {
              entityName: 'CloudTrail Records',
              entityDescription: 'Details for the results from CloudTrail table.',
              entitySynonyms: [],
              definition: [
                {
                  fieldName: 'Record_Id',
                },
                {
                  fieldName: 'Status',
                },
                {
                  fieldName: 'Timestamp',
                },
                {
                  fieldName: 'UId',
                },
                {
                  fieldName: 'Region',
                },
                {
                  fieldName: 'Account_Id',
                },
                {
                  fieldName: 'Type',
                },
                {
                  fieldName: 'Activity',
                },
                {
                  fieldName: 'Actor_User_Type',
                },
                {
                  fieldName: 'Category',
                },
                {
                  fieldName: 'Class',
                },
                {
                  fieldName: 'Cloud_Provider',
                },
                {
                  fieldName: 'Email_Address',
                },
                {
                  fieldName: 'Product_Name',
                },
                {
                  fieldName: 'Geo_Location',
                },
                {
                  fieldName: 'Is_Cross_Account',
                },
                {
                  fieldName: 'MFA_Used',
                },
                {
                  fieldName: 'Service',
                },
                {
                  fieldName: 'Severity',
                },
                {
                  fieldName: 'Source_IP',
                },
                {
                  fieldName: 'Username',
                },
                {
                  fieldName: 'User_Agent',
                },
                {
                  fieldName: 'Api_Operation',
                },
              ],
            },
          ],
        },
      ],
    });

    //cloudTrailTopic.addDependency(quickSightDataSetCreateCustomResource.node.defaultChild as cdk.CfnResource);
    cloudTrailTopic.addDependency(createQuickSightDataSetRefreshSchedulesCustomResource.node.defaultChild as cdk.CfnResource);
    setCondition(cloudTrailTopic, createQForQuicksightTopics);

    // Amazon Q Security Hub Topic
    const securityHubTopic = new CfnTopic(this, 'SecurityHubTopic', {
      name: 'SecurityInsights-SecurityHubTopic',
      description: 'This is a topic for Security Hub data source',
      awsAccountId: Aws.ACCOUNT_ID,
      topicId: 'SecurityInsights-SecurityHubTopic',
      userExperienceVersion: 'NEW_READER_EXPERIENCE',
      dataSets: [
        {
          datasetArn: `arn:${Aws.PARTITION}:quicksight:${Aws.REGION}:${Aws.ACCOUNT_ID}:dataset/Security_Insights_Security_Hub_Dataset`,
          datasetName: 'Security_Insights_Security_Hub_Dataset',
          columns: [
            {
              columnName: 'UID',
              columnFriendlyName: 'UID',
              columnDescription: '',
              columnSynonyms: [
                'Event',
                'document',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Identifier',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Product_Name',
              columnFriendlyName: 'Product',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Product_Vendor_Name',
              columnFriendlyName: 'Vendor',
              columnDescription: '',
              columnSynonyms: [
                'manufacturer name',
                'product seller name',
                'supplier name',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              semanticType: {
                typeName: 'Organization',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Processed_Timestamp',
              columnFriendlyName: 'Processed Timestamp',
              columnDescription: '',
              columnSynonyms: [
                'processed time',
                'processed date',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              semanticType: {
                typeName: 'Date',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Timestamp',
              columnFriendlyName: 'Timestamp',
              columnDescription: '',
              columnSynonyms: [
                'date',
                'time period',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Date',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Confidence_Score',
              columnFriendlyName: 'Confidence Score',
              columnDescription: '',
              columnSynonyms: [
                'confidence rating',
                'trust score',
                'confidence level',
              ],
              columnDataRole: 'MEASURE',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Cloud_Provider',
              columnFriendlyName: 'Cloud Provider',
              columnDescription: '',
              columnSynonyms: [
                'cloud supplier',
                'cloud vendor',
                'cloud company',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              semanticType: {
                typeName: 'Organization',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Created_Timestamp',
              columnFriendlyName: 'Created Timestamp',
              columnDescription: '',
              columnSynonyms: [
                'creation timestamp',
                'created time',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Date',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Title',
              columnFriendlyName: 'Title',
              columnDescription: '',
              columnSynonyms: [
                'name',
                'description',
                'document',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'First_Seen_Timestamp',
              columnFriendlyName: 'First Seen Timestamp',
              columnDescription: '',
              columnSynonyms: [
                'first viewed time',
                'first seen time',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              semanticType: {
                typeName: 'Date',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Last_Seen_Timestamp',
              columnFriendlyName: 'Last Seen Timestamp',
              columnDescription: '',
              columnSynonyms: [
                'last seen times',
                'last visited time',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              semanticType: {
                typeName: 'Date',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Compliance_Control',
              columnFriendlyName: 'Compliance Control',
              columnDescription: '',
              columnSynonyms: [
                'compliance check',
                'compliance management',
                'compliance audit',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Compliance_Status',
              columnFriendlyName: 'Compliance',
              columnDescription: '',
              columnSynonyms: [
                'compliance level',
                'regulatory status',
                'certification status',
                'compliance status',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Compliance_Status_Code',
              columnFriendlyName: 'Compliance Status Code',
              columnDescription: '',
              columnSynonyms: [
                'conformity status',
                'conformity status code',
                'audit status',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Class',
              columnFriendlyName: 'Class',
              columnDescription: '',
              columnSynonyms: [
                'subclass',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Category',
              columnFriendlyName: 'Category',
              columnDescription: '',
              columnSynonyms: [
                'classification',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Activity',
              columnFriendlyName: 'Activity',
              columnDescription: '',
              columnSynonyms: [
                'action',
                'occurrence',
                'task',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Type',
              columnFriendlyName: 'Type',
              columnDescription: '',
              columnSynonyms: [
                'form',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Severity',
              columnFriendlyName: 'Severity',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Status',
              columnFriendlyName: 'Status',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Account_Id',
              columnFriendlyName: 'Account Id',
              columnDescription: '',
              columnSynonyms: [
                'customer id',
                'customer account',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Identifier',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Region',
              columnFriendlyName: 'Region',
              columnDescription: '',
              columnSynonyms: [
                'area',
                'geographical area',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Location',
                subTypeName: 'Level200',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Host_Name',
              columnFriendlyName: 'Host Name',
              columnDescription: '',
              columnSynonyms: [
                'server name',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Ip_Address',
              columnFriendlyName: 'Ip Address',
              columnDescription: '',
              columnSynonyms: [
                'IP adress',
                'IP',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'User_Name',
              columnFriendlyName: 'User Name',
              columnDescription: '',
              columnSynonyms: [
                'customer name',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Email_Address',
              columnFriendlyName: 'Email Address',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'End_Point',
              columnFriendlyName: 'End Point',
              columnDescription: '',
              columnSynonyms: [
                'termination point',
                'end destination',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Geo_Location',
              columnFriendlyName: 'Geo Location',
              columnDescription: '',
              columnSynonyms: [
                'locale',
                'geography',
                'geographic location',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Workflow_State',
              columnFriendlyName: 'Workflow',
              columnDescription: '',
              columnSynonyms: [
                'process state',
                'working state',
                'workflow status',
                'workflow state',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Record_State',
              columnFriendlyName: 'Record',
              columnDescription: '',
              columnSynonyms: [
                'document state',
                'record status',
                'record state',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Finding_Id',
              columnFriendlyName: 'Finding Id',
              columnDescription: '',
              columnSynonyms: [
                'discovery id',
                'found',
                'determination id',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              semanticType: {
                typeName: 'Identifier',
              },
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Resource_Type',
              columnFriendlyName: 'Resource Type',
              columnDescription: '',
              columnSynonyms: [],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: false,
              neverAggregateInFilter: false,
            },
            {
              columnName: 'Compliance_Standard',
              columnFriendlyName: 'Compliance Standard',
              columnDescription: '',
              columnSynonyms: [
                'conformity standard',
                'conformity',
                'requirements',
              ],
              columnDataRole: 'DIMENSION',
              isIncludedInTopic: true,
              neverAggregateInFilter: false,
            },
          ],
          namedEntities: [
            {
              entityName: 'Security Hub Findings Records',
              entityDescription: 'Security Hub Findings Records',
              entitySynonyms: [],
              definition: [
                {
                  fieldName: 'Finding_Id',
                },
                {
                  fieldName: 'Workflow_State',
                },
                {
                  fieldName: 'Status',
                },
                {
                  fieldName: 'Record_State',
                },
                {
                  fieldName: 'Compliance_Status',
                },
                {
                  fieldName: 'Resource_Type',
                },
                {
                  fieldName: 'First_Seen_Timestamp',
                },
                {
                  fieldName: 'Last_Seen_Timestamp',
                },
                {
                  fieldName: 'Title',
                },
                {
                  fieldName: 'Type',
                },
                {
                  fieldName: 'Account_Id',
                },
                {
                  fieldName: 'Activity',
                },
                {
                  fieldName: 'Category',
                },
                {
                  fieldName: 'Class',
                },
                {
                  fieldName: 'Compliance_Control',
                },
                {
                  fieldName: 'Compliance_Standard',
                },
                {
                  fieldName: 'Compliance_Status_Code',
                },
                {
                  fieldName: 'Confidence_Score',
                },
                {
                  fieldName: 'Created_Timestamp',
                },
                {
                  fieldName: 'Product_Name',
                },
                {
                  fieldName: 'Severity',
                },
                {
                  fieldName: 'User_Name',
                },
                {
                  fieldName: 'Product_Vendor_Name',
                },
                {
                  fieldName: 'Timestamp',
                },
                {
                  fieldName: 'Region',
                },
                {
                  fieldName: 'Ip_Address',
                },
                {
                  fieldName: 'Host_Name',
                },
                {
                  fieldName: 'Geo_Location',
                },
                {
                  fieldName: 'End_Point',
                },
                {
                  fieldName: 'Processed_Timestamp',
                },
                {
                  fieldName: 'Email_Address',
                },
                {
                  fieldName: 'Cloud_Provider',
                },
                {
                  fieldName: 'UID',
                },
              ],
            },
          ],
        },
      ],
    });

    //securityHubTopic.addDependency(quickSightDataSetCreateCustomResource.node.defaultChild as cdk.CfnResource);
    securityHubTopic.addDependency(createQuickSightDataSetRefreshSchedulesCustomResource.node.defaultChild as cdk.CfnResource);
    setCondition(securityHubTopic, createQForQuicksightTopics);

    return {cloudTrailTopic, securityHubTopic}
  }
}
