// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_AppFabric_IP_Address_Logins',
    Name: 'Security_Insights_AppFabric_IP_Address_Logins',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_AppFabric_IP_Address_Logins",
          SqlQuery: "SELECT device.ip as \"IP Address\",\n\tCOUNT(\n\t\tdevice.ip\n\t) as Count,\n\tmetadata.product.vendor_name as \"Vendor Name\"\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE eventDay BETWEEN CAST(\n\t\tdate_format(current_timestamp - INTERVAL 'query_window_duration' day, '%Y%m%d%H') as varchar\n\t)\n\tand CAST(\n\t\tdate_format(current_timestamp - INTERVAL '0' day, '%Y%m%d%H') as varchar\n\t)\nAND activity_name = 'Logon'\nGROUP BY device.ip,\n\tmetadata.product.vendor_name\nORDER BY Count DESC\nLIMIT 25",
          Columns: [
              {
                  Name: "IP Address",
                  Type: "STRING"
              },
              {
                  Name: "Count",
                  Type: "INTEGER"
              },
              {
                  Name: "Vendor Name",
                  Type: "STRING"
              }
          ]
      },
    },
    },
    LogicalTableMap: {
      '6bea002a-ef77-4a88-807a-004deed07d70': {
        Alias: 'Security_Insights_AppFabric_IP_Address_Logins',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "IP Address",
                "Count",
                "Vendor Name"
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
        Name: "IP Address",
        Type: "STRING"
      },
      {
          Name: "Count",
          Type: "INTEGER"
      },
      {
          Name: "Vendor Name",
          Type: "STRING"
      }
    ],
    DataSetUsageConfiguration: {
      DisableUseAsDirectQuerySource: false,
      DisableUseAsImportedSource: false,
    },
  };
  