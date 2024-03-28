// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
  DataSetId: 'Security_Insights_Security_Hub_Findings_By_Severity',
  Name: 'Security_Insights_Security_Hub_Findings_By_Severity',
  PhysicalTableMap: {
    '60ace416-784e-4798-8766-58bf09b9faaf': {
      CustomSql: {
        DataSourceArn: "test",
        Name: "Security_Insights_Security_Hub_Findings_By_Severity",
        SqlQuery: "SELECT count(*) AS \"Count\",\n\tseverity AS \"Severity\",\n\tstatus AS \"Status\"\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\n\tAND status IN ('New', 'Resolved')\n\tAND severity IN ('Critical', 'High', 'Medium', 'Low')\nGROUP BY status,\n\tseverity",
        Columns: [
            {
                Name: "Count",
                Type: "INTEGER"
            },
            {
                Name: "Severity",
                Type: "STRING"
            },
            {
                Name: "Status",
                Type: "STRING"
            }
        ]
    },
    },
  },
  LogicalTableMap: {
    '0316e9e9-049e-4089-90b4-b9442e560294': {
      Alias: 'Security_Insights_Security_Hub_Findings_By_Severity',
      DataTransforms: [
        {
          ProjectOperation: {
            ProjectedColumns: [
              "Count",
              "Severity",
              "Status"
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
      Name: "Count",
      Type: "INTEGER"
    },
    {
        Name: "Severity",
        Type: "STRING"
    },
    {
        Name: "Status",
        Type: "STRING"
    }
],
  DataSetUsageConfiguration: {
    DisableUseAsDirectQuerySource: false,
    DisableUseAsImportedSource: false,
  },
};
