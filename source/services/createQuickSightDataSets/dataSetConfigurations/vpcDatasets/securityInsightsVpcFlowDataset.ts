// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
  DataSetId: 'Security_Insights_VPC_Flow_Dataset',
  Name: 'Security_Insights_VPC_Flow_Dataset',
  PhysicalTableMap: {
    '60ace416-784e-4798-8766-58bf09b9faaf': {
      CustomSql: {
        DataSourceArn: 'test',
        Name: 'Security_Insights_VPC_Flow_Dataset',
        SqlQuery: "SELECT \ntime_dt as Timestamp,\nconnection_info.direction AS Direction,\ndisposition as Disposition,\nregion as Region,\nsrc_endpoint.ip as Source_IP,\ndst_endpoint.ip as Destination_IP\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN (current_timestamp - INTERVAL  '7' DAY) AND CURRENT_TIMESTAMP \nAND status_code = 'OK'",
        Columns: [
          {
            "Name": "Timestamp",
            "Type": "DATETIME"
          },
          {
            "Name": "Direction",
            "Type": "STRING"
          },
          {
            "Name": "Disposition",
            "Type": "STRING"
          },
          {
            "Name": "Region",
            "Type": "STRING"
          },
          {
            "Name": "Source_IP",
            "Type": "STRING"
          },
          {
            "Name": "Destination_IP",
            "Type": "STRING"
          }
        ],
      },
    },
  },
  LogicalTableMap: {
    'fa71007f-0e00-4574-9a31-65c6c274ff26': {
      Alias: 'Security_Insights_VPC_Flow_Dataset',
      DataTransforms: [
        {
          ProjectOperation: {
            ProjectedColumns: [
              "Timestamp",
              "Direction",
              "Disposition",
              "Region",
              "Source_IP",
              "Destination_IP",
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
      "Name": "Timestamp",
      "Type": "DATETIME"
    },
    {
      "Name": "Direction",
      "Type": "STRING"
    },
    {
      "Name": "Disposition",
      "Type": "STRING"
    },
    {
      "Name": "Region",
      "Type": "STRING"
    },
    {
      "Name": "Source_IP",
      "Type": "STRING"
    },
    {
      "Name": "Destination_IP",
      "Type": "STRING"
    },
  ],
  DataSetUsageConfiguration: {
    DisableUseAsDirectQuerySource: false,
    DisableUseAsImportedSource: false,
  },
};
