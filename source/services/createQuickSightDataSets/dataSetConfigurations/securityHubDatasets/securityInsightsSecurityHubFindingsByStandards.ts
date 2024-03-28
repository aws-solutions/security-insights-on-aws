// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
  DataSetId: 'Security_Insights_Security_Hub_Findings_By_Standards',
  Name: 'Security_Insights_Security_Hub_Findings_By_Standards',
  PhysicalTableMap: {
    '60ace416-784e-4798-8766-58bf09b9faaf': {
      CustomSql: {
        DataSourceArn: "test",
        Name: "Security_Insights_Security_Hub_Findings_By_Standards",
        SqlQuery: "WITH TopStandards AS (\n\tSELECT standard,\n\t\tCOUNT(*) AS count\n\tFROM \"test_database_name\".\"test_datatable_name\"\n\t\tCROSS JOIN UNNEST(compliance.standards) AS t(standard)\n\tWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\t\tAND CURRENT_TIMESTAMP\n\tGROUP BY standard\n\tORDER BY count DESC\n\tLIMIT 25\n), standardDetails AS (\n\tSELECT status,\n\t\tseverity,\n\t\tfinding_info.title AS \"Finding\",\n\t\tresource.type AS \"ResourceType\",\n\t\taccountid,\n\t\tregion,\n\t\tunmapped [ 'WorkflowState' ] AS \"WorkflowState\",\n\t\tstandardID,\n\t\tROW_NUMBER() OVER(PARTITION BY status, severity, standardID) AS row_num\n\tFROM \"test_database_name\".\"test_datatable_name\"\n\t\tCROSS JOIN UNNEST(compliance.standards) AS t(standardID)\n\tWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\t\tAND CURRENT_TIMESTAMP\n)\nSELECT *\nFROM standardDetails sd\n\tJOIN topStandards ts ON sd.standardID = ts.standard\nWHERE sd.row_num <= 25",
        Columns: [
            {
                Name: "status",
                Type: "STRING"
            },
            {
                Name: "severity",
                Type: "STRING"
            },
            {
                Name: "Finding",
                Type: "STRING"
            },
            {
                Name: "ResourceType",
                Type: "STRING"
            },
            {
                Name: "accountid",
                Type: "STRING"
            },
            {
                Name: "region",
                Type: "STRING"
            },
            {
                Name: "WorkflowState",
                Type: "STRING"
            },
            {
                Name: "standardID",
                Type: "STRING"
            },
            {
                Name: "row_num",
                Type: "INTEGER"
            },
            {
                Name: "standard",
                Type: "STRING"
            },
            {
                Name: "count",
                Type: "INTEGER"
            }
        ]
    }
,
    },
  },
  LogicalTableMap: {
    '0316e9e9-049e-4089-90b4-b9442e560294': {
      Alias: 'Security_Insights_Security_Hub_Findings_By_Standards',
      DataTransforms: [
        {
          ProjectOperation: {
            ProjectedColumns: [
            "status",
            "severity",
            "Finding",
            "ResourceType",
            "accountid",
            "region",
            "WorkflowState",
            "standardID",
            "row_num",
            "standard",
            "count"
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
        Name: "status",
        Type: "STRING"
    },
    {
        Name: "severity",
        Type: "STRING"
    },
    {
        Name: "Finding",
        Type: "STRING"
    },
    {
        Name: "ResourceType",
        Type: "STRING"
    },
    {
        Name: "accountid",
        Type: "STRING"
    },
    {
        Name: "region",
        Type: "STRING"
    },
    {
        Name: "WorkflowState",
        Type: "STRING"
    },
    {
        Name: "standardID",
        Type: "STRING"
    },
    {
        Name: "row_num",
        Type: "INTEGER"
    },
    {
        Name: "standard",
        Type: "STRING"
    },
    {
        Name: "count",
        Type: "INTEGER"
    }
],
  DataSetUsageConfiguration: {
    DisableUseAsDirectQuerySource: false,
    DisableUseAsImportedSource: false,
  },
};
