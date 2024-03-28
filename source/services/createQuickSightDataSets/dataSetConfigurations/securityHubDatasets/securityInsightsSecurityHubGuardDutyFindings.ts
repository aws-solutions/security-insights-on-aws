// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
  DataSetId: 'Security_Insights_Security_Hub_GuardDuty_Findings',
  Name: 'Security_Insights_Security_Hub_GuardDuty_Findings',
  PhysicalTableMap: {
    '60ace416-784e-4798-8766-58bf09b9faaf': {
      CustomSql: {
        DataSourceArn: "test",
        Name: "Security_Insights_Security_Hub_GuardDuty_Findings",
        SqlQuery: "SELECT COUNT(*) AS \"Count\",\n\tstatus AS Status,\n\tseverity AS Severity\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\n\tAND metadata.product.name = 'GuardDuty'\n\tAND status IN ('New', 'Resolved')\n\tAND severity IN ('Critical', 'High', 'Medium', 'Low')\nGROUP BY status,\n\tseverity",
        Columns: [
            {
                Name: "Count",
                Type: "INTEGER"
            },
            {
                Name: "Status",
                Type: "STRING"
            },
            {
                Name: "Severity",
                Type: "STRING"
            }
        ]
    },
  },
  },
  LogicalTableMap: {
    '0316e9e9-049e-4089-90b4-b9442e560294': {
      Alias: 'Security_Insights_Security_Hub_GuardDuty_Findings',
      DataTransforms: [
        {
          ProjectOperation: {
            ProjectedColumns: [
              "Count",
              "Status",
              "Severity"
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
      Name: "Status",
      Type: "STRING"
  },
  {
      Name: "Severity",
      Type: "STRING"
  }
],
  DataSetUsageConfiguration: {
    DisableUseAsDirectQuerySource: false,
    DisableUseAsImportedSource: false,
  },
};
