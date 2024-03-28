// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_AppFabric_Apps_Failed_Logins',
    Name: 'Security_Insights_AppFabric_Apps_Failed_Logins',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_AppFabric_Apps_Failed_Logins",
          SqlQuery: "SELECT COUNT(*) as \"Count\",\n\tmetadata.product.vendor_name AS \"Vendor\",\n\tstatus as \"Status\"\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE eventDay BETWEEN CAST(\n\t\tdate_format(current_timestamp - INTERVAL 'query_window_duration' day, '%Y%m%d%H') as varchar\n\t)\n\tand CAST(\n\t\tdate_format(current_timestamp - INTERVAL '0' day, '%Y%m%d%H') as varchar\n\t)\n\tAND status = 'Failure'\n\tAND activity_name = 'Logon'\nGROUP BY metadata.product.vendor_name, status\nORDER By Count desc \nLIMIT 25",
          Columns: [
              {
                  Name: "Count",
                  Type: "INTEGER"
              },
              {
                  Name: "Vendor",
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
        Alias: 'Security_Insights_AppFabric_Apps_Failed_Logins',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "Count",
                "Vendor",
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
          Name: "Vendor",
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
  