// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_Route_Table_Changes',
    Name: 'Security_Insights_Cloudtrail_Route_Table_Changes',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_Cloudtrail_Route_Table_Changes",
          SqlQuery: "SELECT COUNT(*) AS \"Count\",\n\tapi.operation AS \"ActivityType\",\n\tstatus AS \"Status\"\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\n\tAND (\n\t\tapi.operation IN (\n\t\t\t'CreateLocalGatewayRouteTable',\n\t\t\t'AssociateRouteTable',\n\t\t\t'CreateLocalGatewayRouteTable',\n\t\t\t'CreateTransitGatewayRouteTable',\n\t\t\t'DeleteLocalGatewayRouteTable',\n\t\t\t'DeleteRouteTable',\n\t\t\t'DeleteTransitGatewayRouteTable',\n\t\t\t'DescribeRouteTables',\n\t\t\t'DisassociateRouteTable',\n\t\t\t'DisassociateTransitGatewayRouteTable'\n\t\t)\n\t)\nGROUP BY api.operation,\n\tstatus",
          Columns: [
              {
                  Name: "Count",
                  Type: "INTEGER"
              },
              {
                  Name: "ActivityType",
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
        Alias: 'Security_Insights_Cloudtrail_Route_Table_Changes',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "Count",
                "ActivityType",
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
          Name: "ActivityType",
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
  