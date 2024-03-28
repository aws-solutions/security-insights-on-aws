// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_Accounts_API_Failures',
    Name: 'Security_Insights_Cloudtrail_Accounts_API_Failures',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_Cloudtrail_Accounts_API_Failures",
          SqlQuery: "SELECT count(*) AS \"Count\",\n\taccountid AS \"AccountID\"\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\n\tAND status = 'Failure'\nGROUP BY accountid\nORDER BY count(*) DESC\nLIMIT 25",
          Columns: [
              {
                  Name: "Count",
                  Type: "INTEGER"
              },
              {
                  Name: "AccountID",
                  Type: "STRING"
              }
          ]
      },
    },
    },
    LogicalTableMap: {
      '6bea002a-ef77-4a88-807a-004deed07d70': {
        Alias: 'Security_Insights_Cloudtrail_Accounts_API_Failures',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "Count",
                "AccountID"
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
        Name: "AccountID",
        Type: "STRING"
      }
    ],
    DataSetUsageConfiguration: {
      DisableUseAsDirectQuerySource: false,
      DisableUseAsImportedSource: false,
    },
  };
  