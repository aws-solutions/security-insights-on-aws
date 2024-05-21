// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DayOfWeek, IngestionType, RefreshInterval } from "@aws-sdk/client-quicksight"

export const createEventWithDailySchedule = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",
    "ResourceType": "Custom::CreateQuickSightDataSetRefreshSchedules",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Daily"
    }
}

export const testContext = {
    "invokedFunctionArn": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "awsRequestId": "testID"
}

export const dailyInterval: RefreshInterval= 'DAILY'
export const weeklyInterval: RefreshInterval= 'WEEKLY'
export const monthlyInterval: RefreshInterval= 'MONTHLY'

export const refreshType: IngestionType = "FULL_REFRESH"
export const createDailyRefreshScheduleCommandInput = {
    "AwsAccountId": "111111111111", 
    "DataSetId": "Security_Insights_Vpc_Flow_Destination_Inbound", 
    "Schedule": 
    {
        "RefreshType": refreshType, 
        "ScheduleFrequency": {
            "Interval": dailyInterval
        },  "ScheduleId": "Security_Insights_Vpc_Flow_Destination_Inbound"
    }
}
export const dayOfWeek: DayOfWeek = "MONDAY"
export const createWeeklyRefreshScheduleCommandInput = {
    "AwsAccountId": "111111111111", 
    "DataSetId": "Security_Insights_Vpc_Flow_Destination_Inbound", 
    "Schedule": {
        "RefreshType": refreshType, 
        "ScheduleFrequency": {
            "Interval": weeklyInterval,
            "RefreshOnDay": {
                "DayOfWeek": dayOfWeek
            }
        },  "ScheduleId": "Security_Insights_Vpc_Flow_Destination_Inbound"
    }
}
export const createMonthlyRefreshScheduleCommandInput = {
    "AwsAccountId": "111111111111", 
    "DataSetId": "Security_Insights_Vpc_Flow_Destination_Inbound", 
    "Schedule": 
    {
        "RefreshType": refreshType, 
        "ScheduleFrequency": {
            "Interval": monthlyInterval,
            "RefreshOnDay": {
                "DayOfMonth": "1"
            }
        },  "ScheduleId": "Security_Insights_Vpc_Flow_Destination_Inbound"
    }
}
export const createEventWithWeeklySchedule = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",
    "ResourceType": "Custom::CreateQuickSightDataSetRefreshSchedules",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Weekly"
    }
}
export const createEventWithMonthlySchedule = {
    "RequestType": "Create",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",
    "ResourceType": "Custom::CreateQuickSightDataSetRefreshSchedules",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Monthly"
    }
}
export const updateEventFromWeeklyToDailySchedule = {
    "RequestType": "Update",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",
    "ResourceType": "Custom::CreateQuickSightDataSetRefreshSchedules",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Daily",
        "Version": "1.0.0"
    },
    "OldResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Weekly",
        "Version": "1.0.0"
    }
}
export const deleteEventWithDailySchedule = {
        "RequestType": "Delete",
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
        "ResponseURL": "testURL",
        "StackId": "testId",
        "RequestId": "testId",
        "LogicalResourceId": "testId",
        "ResourceType": "Custom::CreateQuickSightDataSetRefreshSchedules",
        "ResourceProperties": {
            "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
            "DayOfWeek": "MONDAY",
            "AccountId": "111111111111",
            "DayOfMonth": "1",
            "Region": "us-east-1",
            "RefreshType": "FULL_REFRESH",
            "Interval": "Daily"
        }
}

export const deleteRefreshScheduleCommandInput = 
{
    "AwsAccountId": "111111111111", 
    "DataSetId": "Security_Insights_Vpc_Flow_Destination_Inbound", 
    "ScheduleId": "Security_Insights_Vpc_Flow_Destination_Inbound"
}

export const responseUrl = "testURL"
export const responseBodySuccess = "{\"Status\":\"SUCCESS\",\"Reason\":\"\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\"}"
export const responseConfig  =  {"headers": {"Content-Length": 131, "Content-Type": ""}}

export const reponseBodyFailure = "{\"Status\":\"FAILED\",\"Reason\":\"CreateScheduleError\",\"PhysicalResourceId\":\"testId\",\"StackId\":\"testId\",\"RequestId\":\"testId\",\"LogicalResourceId\":\"testId\"}"
export const responseConfigFailure  =  {"headers": {"Content-Length": 149, "Content-Type": ""}}
export const responseConfigFailureForDeletion  =  {"headers": {"Content-Length": 368, "Content-Type": ""}}
export const responseBodyFailureForDeletion = "{\"Status\":\"FAILED\",\"Reason\":\"See the details in CloudWatch Log Stream: undefined\",\"PhysicalResourceId\":\"QuickSightDataSetCreator\",\"StackId\":\"arn:aws:cloudformation:us-east-1:111111111111:stack/testversion/\",\"RequestId\":\"11111111-1111-1111-1111-111111111\",\"LogicalResourceId\":\"QuickSightDataSetCreator\",\"Data\":{\"Error\":{\"Code\":\"CustomResourceError\",\"Message\":\"Error\"}}}"

export const solutionUpgradeEvent1 = {
    "RequestType": "Update",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",
    "ResourceType": "Custom::CreateQuickSightDataSetRefreshSchedules",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Daily",
        "Version": "1.0.1"
    },
    "OldResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Weekly",
        "Version": "1.0.0"
    }
}
export const solutionUpgradeEvent2 = {
    "RequestType": "Update",
    "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:testFunction",
    "ResponseURL": "testURL",
    "StackId": "testId",
    "RequestId": "testId",
    "LogicalResourceId": "testId",
    "ResourceType": "Custom::CreateQuickSightDataSetRefreshSchedules",
    "ResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Daily",
        "Version": "1.0.1"
    },
    "OldResourceProperties": {
        "ServiceToken": "arn:aws:lambda:us-east-1:111111111111:function:test",
        "DayOfWeek": "MONDAY",
        "AccountId": "111111111111",
        "DayOfMonth": "1",
        "Region": "us-east-1",
        "RefreshType": "FULL_REFRESH",
        "Interval": "Weekly",
    }
}