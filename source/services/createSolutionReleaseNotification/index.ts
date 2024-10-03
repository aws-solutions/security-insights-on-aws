// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    CreateOpsItemCommand,
    CreateOpsItemCommandInput,
    DescribeOpsItemsCommand,
    DescribeOpsItemsCommandInput,
    DescribeOpsItemsCommandOutput,
    OpsItem,
    OpsItemSummary,
    SSMClient,
    UpdateOpsItemCommand,
} from '@aws-sdk/client-ssm';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import axios from 'axios';
import { logger } from './utils/logger';


const APPLICATION_TAG_KEY = process.env.APPLICATION_TAG_KEY
const APPLICATION_TAG_VALUE = process.env.APPLICATION_TAG_VALUE
const CREATE_QUICKSIGHT_DATASETS_LAMBDA_FUNCTION_ARN = process.env.CREATE_QUICKSIGHT_DATASETS_LAMBDA_FUNCTION_ARN
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN
const SOLUTION_GIT_REPO_URL = process.env.SOLUTION_GIT_REPO_URL!;
const AWS_REGION = process.env.Region
const ssmClient = new SSMClient({ region: AWS_REGION });
const stsClient = new STSClient({ region: AWS_REGION });
const SOURCE = 'GitHub/AWS-Solutions'
const SEVERITY = '3'
const PRIORITY = 3
const DEDUP_STRING = 'SecurityInsightsSolution'
const TITLE = 'New release available for Security Insights Solution'
const OPSITEM_DESCRIPTION = `A new release is available for this Solution.
    For ChangeLog see the url: https://github.com/aws-solutions/security-insights-on-aws/blob/main/CHANGELOG.md.
    Please navigate to this url to update the solution: https://aws.amazon.com/solutions/implementations/security-insights-on-aws/`;




export const handler = async () => {
    const CURRENT_RELEASE_TAG = process.env.CURRENT_RELEASE_TAG;

    try {        
        logger.info("Handler execution started")
        const releaseTag: string = await getLatestReleaseTag();
        logger.info(`Current release tag from env variable is ${CURRENT_RELEASE_TAG}`)
        logger.info(`Latest release tag from GitHub is ${releaseTag}`);
        if (releaseTag.trim().toLowerCase() !== CURRENT_RELEASE_TAG?.trim()?.toLowerCase()) {
            logger.info("As release tags do not match, creating Ops Item for the release.")
            await createOpsItemForNewRelease()
        }
        else {
            logger.info("As release tags match, resolving Ops Item for the release.")
            await resolveOlderOpsItems()
        }
    } catch (error) {
        logger.error({
            label: 'CreateSolutionReleaseNotification/Handler',
            message: {
              data: 'Error occurred while creating release notification',
              error: error,
            },
          });
        throw error;
    }
};

async function getLatestReleaseTag(): Promise<string> {
    const response = await axios.get(SOLUTION_GIT_REPO_URL);
    const latestRelease = response.data;
    return latestRelease.tag_name
}

async function createOpsItemForNewRelease(): Promise<void> {
    const params: CreateOpsItemCommandInput = {
        Title: TITLE,
        Description: OPSITEM_DESCRIPTION,
        Source: SOURCE,
        Severity: SEVERITY,
        Priority: PRIORITY,
        OperationalData: {
            '/aws/resources': {
                Value: `[{"arn":"${CREATE_QUICKSIGHT_DATASETS_LAMBDA_FUNCTION_ARN}"}]`,
                Type: 'SearchableString'
            },
            '/aws/dedup': {
                Value: `{"dedupString": "${DEDUP_STRING}"}`,
                Type: 'SearchableString'
            }
        },
        Notifications: [
            {
                Arn: SNS_TOPIC_ARN
            }
        ],
        Tags: [
            {
                Key: APPLICATION_TAG_KEY,
                Value: APPLICATION_TAG_VALUE
            }
        ]
    };
    const command = new CreateOpsItemCommand(params);
    try {
        const data = await ssmClient.send(command);
        logger.info(`OpsItem created with ID: ${data.OpsItemId}`);
    } catch (error: any) {
        if (error.name === "OpsItemAlreadyExistsException") {
            // catch error gracefully. since the Ops Item exists, no further action is required.
            logger.error("Ops Item already exists:", error.message);
        } else {
            logger.error("Error creating OpsItem:", error);
            throw error
        }
    }
}

async function resolveOlderOpsItems(): Promise<void> {
    const assumedRoleArn = await getAssumedRoleArn()
    logger.info(`Assumed role arn is ${assumedRoleArn}`)
    const opsItems = await getOpsItemsByUser(assumedRoleArn);
    logger.info(`List of ops items is ${opsItems}`)
    for (const opsItem of opsItems) {
        if (opsItem.Status !== 'Resolved') {
            logger.info(`Resolving OpsItem ID: ${opsItem.OpsItemId}`);
            await updateOpsItem(opsItem.OpsItemId!);
        }
    }
}

async function getAssumedRoleArn(): Promise<string> {
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);
    return response.Arn!;
}

async function getOpsItemsByUser(userName: string): Promise<OpsItemSummary[]> {
    const describeOpsItemInput: DescribeOpsItemsCommandInput = {
        OpsItemFilters: [
            {
                Key: 'Status',
                Values: ['Open'],
                Operator: 'Equal',
            },
            {
                Key: 'Source',
                Values: [SOURCE],
                Operator: 'Equal',
            },
            {
                Key: 'Title',
                Values: [TITLE],
                Operator: 'Equal',
            },
        ],
    };
    const command: DescribeOpsItemsCommand = new DescribeOpsItemsCommand(describeOpsItemInput)
    let response: DescribeOpsItemsCommandOutput = await ssmClient.send(command);
    let opsItems: OpsItem[] = response.OpsItemSummaries ? response.OpsItemSummaries: [];
    while(response.NextToken) {
        describeOpsItemInput.NextToken = response.NextToken;
        const command: DescribeOpsItemsCommand = new DescribeOpsItemsCommand(describeOpsItemInput);
        response = await ssmClient.send(command);
        opsItems = response.OpsItemSummaries ? opsItems.concat(response.OpsItemSummaries): opsItems
    }
    return opsItems.filter(item => item.CreatedBy===userName)
}

async function updateOpsItem(opsItemId: string): Promise<void>{
    const command = new UpdateOpsItemCommand({
        OpsItemId: opsItemId,
        Status: 'Resolved'
    });
    await ssmClient.send(command);
}