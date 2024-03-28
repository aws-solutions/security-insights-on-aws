// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_API_Operations',
    Name: 'Security_Insights_Cloudtrail_API_Operations',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_Cloudtrail_API_Operations",
          SqlQuery: "SELECT count(*) AS \"Count\",\n\tapi.operation AS \"Operation\",\n\tstatus AS \"Status\"\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\n\tAND status IN ('Success', 'Failure')\nGROUP BY api.operation,\n\tstatus\nORDER BY count(*) DESC\nLIMIT 10",
          Columns: [
              {
                  Name: "Count",
                  Type: "INTEGER"
              },
              {
                  Name: "Operation",
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
      '6bea002a-ef77-4a88-807a-004deed07d70': {
        Alias: 'Security_Insights_Cloudtrail_API_Operations',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "Count",
                "Operation",
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
        Name: "Operation",
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
  