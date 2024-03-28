// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Vpc_Flow_Total_Bytes_Region',
    Name: 'Security_Insights_Vpc_Flow_Total_Bytes_Region',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
            DataSourceArn: "test",
            Name: "Security_Insights_Vpc_Flow_Total_Bytes_Region",
            SqlQuery: "SELECT SUM(traffic.bytes) AS \"TotalBytes\",\n\tregion,\n\tdisposition,\n\tconnection_info.direction as direction\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\nGROUP BY region,\n\tdisposition,\n\tconnection_info.direction",
            Columns: [
                {
                    Name: "TotalBytes",
                    Type: "INTEGER"
                },
                {
                    Name: "region",
                    Type: "STRING"
                },
                {
                    Name: "disposition",
                    Type: "STRING"
                },
                {
                    Name: "direction",
                    Type: "STRING"
                }
            ]
        },
      },
    },
    LogicalTableMap: {
      '9af48d85-a269-49e7-a031-5fcb09374936': {
        Alias: 'Security_Insights_Vpc_Flow_Total_Bytes_Region',
        DataTransforms: [
            {
                TagColumnOperation: {
                    ColumnName: "region",
                    Tags: [
                        {
                            "ColumnGeographicRole": "STATE"
                        }
                    ]
                }
            },
            {
                ProjectOperation: {
                    ProjectedColumns: [
                        "TotalBytes",
                        "region",
                        "disposition",
                        "direction"
                    ]
                }
            }
        ],
        Source: {
          PhysicalTableId: '60ace416-784e-4798-8766-58bf09b9faaf',
        },
      },
    },
    OutputColumns: [
        {
            Name: "TotalBytes",
            Type: "INTEGER"
        },
        {
            Name: "region",
            Type: "STRING"
        },
        {
            Name: "disposition",
            Type: "STRING"
        },
        {
            Name: "direction",
            Type: "STRING"
        }
    ],
    DataSetUsageConfiguration: {
      DisableUseAsDirectQuerySource: false,
      DisableUseAsImportedSource: false,
    },
  };
  