// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
  DataSetId: 'Security_Insights_Security_Hub_Unresolved_Findings',
  Name: 'Security_Insights_Security_Hub_Unresolved_Findings',
  PhysicalTableMap: {
    '60ace416-784e-4798-8766-58bf09b9faaf': {
      CustomSql: {
        DataSourceArn: "test",
        Name: "Security_Insights_Security_Hub_Unresolved_Findings",
        SqlQuery: "SELECT DISTINCT unmapped [ 'RecordState' ] AS \"RecordState\",\n\t(finding_info.first_seen_time_dt) AS \"FindingFirstSeenTime\",\n\tunmapped [ 'ProductFields.aws/securityhub/FindingId' ] AS \"FindingUID\",\n\tunmapped [ 'WorkflowState' ] AS \"WorkflowStatus\",\n\tresource.type AS \"ResourceInstanceType\",\n\tresource.uid AS \"ResourceUid\",\n\tfinding_info.title AS \"FindingTitle\",\n\tfinding_info.desc AS \"FindingDescription\",\n\tseverity AS \"Severity\",\n\tcardinality(compliance.standards) AS \"StandardsCount\",\n\tregion AS Region,\n\taccountid AS AccountId\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\nORDER BY FindingFirstSeenTime ASC\nLimit 25",
        Columns: [
            {
                Name: "RecordState",
                Type: "STRING"
            },
            {
                Name: "FindingFirstSeenTime",
                Type: "DATETIME"
            },
            {
                Name: "FindingUID",
                Type: "STRING"
            },
            {
                Name: "WorkflowStatus",
                Type: "STRING"
            },
            {
                Name: "ResourceInstanceType",
                Type: "STRING"
            },
            {
                Name: "ResourceUid",
                Type: "STRING"
            },
            {
                Name: "FindingTitle",
                Type: "STRING"
            },
            {
                Name: "FindingDescription",
                Type: "STRING"
            },
            {
                Name: "Severity",
                Type: "STRING"
            },
            {
                Name: "StandardsCount",
                Type: "INTEGER"
            },
            {
                Name: "Region",
                Type: "STRING"
            },
            {
                Name: "AccountId",
                Type: "STRING"
            }
        ]
    }

,
    },
  },
  LogicalTableMap: {
    '0316e9e9-049e-4089-90b4-b9442e560294': {
      Alias: 'Security_Insights_Security_Hub_Unresolved_Findings',
      DataTransforms: [
        {
          ProjectOperation: {
            ProjectedColumns: [
              "RecordState",
              "FindingFirstSeenTime",
              "FindingUID",
              "WorkflowStatus",
              "ResourceInstanceType",
              "ResourceUid",
              "FindingTitle",
              "FindingDescription",
              "Severity",
              "StandardsCount",
              "Region",
              "AccountId"
            ],
          },
        },
      ],
      Source: {
        PhysicalTableId: '60ace416-784e-4798-8766-58bf09b9faaf',
      },
    },
  },
  OutputColumns: [
    {
        Name: "RecordState",
        Type: "STRING"
    },
    {
        Name: "FindingFirstSeenTime",
        Type: "DATETIME"
    },
    {
        Name: "FindingUID",
        Type: "STRING"
    },
    {
        Name: "WorkflowStatus",
        Type: "STRING"
    },
    {
        Name: "ResourceInstanceType",
        Type: "STRING"
    },
    {
        Name: "ResourceUid",
        Type: "STRING"
    },
    {
        Name: "FindingTitle",
        Type: "STRING"
    },
    {
        Name: "FindingDescription",
        Type: "STRING"
    },
    {
        Name: "Severity",
        Type: "STRING"
    },
    {
        Name: "StandardsCount",
        Type: "INTEGER"
    },
    {
        Name: "Region",
        Type: "STRING"
    },
    {
        Name: "AccountId",
        Type: "STRING"
    }
  ],
  DataSetUsageConfiguration: {
    DisableUseAsDirectQuerySource: false,
    DisableUseAsImportedSource: false,
  },
};
