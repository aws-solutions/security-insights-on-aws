// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Security_Hub_Findings_Summary_Standards',
    Name: 'Security_Insights_Security_Hub_Findings_Summary_Standards',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
            DataSourceArn: "test",
            Name: "Security_Insights_Security_Hub_Findings_Summary_Standards",
            SqlQuery: "SELECT standard AS standard,\n\t\tCOUNT(*) AS count,\n\t\tseverity AS severity\n\tFROM \"test_database_name\".\"test_datatable_name\"\n\t\tCROSS JOIN UNNEST(compliance.standards) AS t(standard)\n\tWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY AND CURRENT_TIMESTAMP\n\t    AND severity IN ('Critical', 'Medium', 'High')\n\tGROUP BY standard, severity\n\tORDER BY count DESC\n\tLIMIT 50",
            Columns: [
                {
                    Name: "standard",
                    Type: "STRING"
                },
                {
                    Name: "count",
                    Type: "INTEGER"
                },
                {
                    Name: "severity",
                    Type: "STRING"
                }
            ]
        }
      },
    },
    LogicalTableMap: {
      '0316e9e9-049e-4089-90b4-b9442e560294': {
        Alias: 'Security_Insights_Security_Hub_Findings_Summary_Standards',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "standard",
                "count",
                "severity"
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
          Name: "standard",
          Type: "STRING"
      },
      {
          Name: "count",
          Type: "STRING"
      },
      {
          Name: "severity",
          Type: "STRING"
      }
  ],
    DataSetUsageConfiguration: {
      DisableUseAsDirectQuerySource: false,
      DisableUseAsImportedSource: false,
    },
  };
  