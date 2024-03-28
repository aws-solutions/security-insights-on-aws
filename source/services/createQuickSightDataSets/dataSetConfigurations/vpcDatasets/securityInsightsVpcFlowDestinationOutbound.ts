// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
  DataSetId: 'Security_Insights_Vpc_Flow_Destination_Outbound',
  Name: 'Security_Insights_Vpc_Flow_Destination_Outbound',
  PhysicalTableMap: {
    '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
            DataSourceArn: "test",
            Name: "Security_Insights_Vpc_Flow_Destination_Outbound",
            SqlQuery: "WITH TopIps AS (\nSELECT SUM(traffic.bytes) AS \"TotalBytes\",\n    dst_endpoint.ip AS \"DestinationIP\",\n    connection_info.direction AS direction,\n    row_number() over (partition by dst_endpoint.ip order by SUM(traffic.bytes) desc) AS country_rank \nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY AND CURRENT_TIMESTAMP\n    AND connection_info.direction = 'Outbound'\nGROUP BY dst_endpoint.ip,\n    connection_info.direction\nORDER BY sum(traffic.bytes) DESC\nLIMIT 25\n),\nTopIpsWithRows AS (\nSELECT\n    vpc_flow.traffic.bytes AS bytes,\n    vpc_flow.accountid,\n    vpc_flow.region,\n    vpc_flow.cloud.zone AS \"zone\",\n    vpc_flow.dst_endpoint.port AS \"DestinationPort\",\n    vpc_flow.dst_endpoint.ip AS \"DestinationIP\",\n    vpc_flow.dst_endpoint.interface_uid AS \"InterfaceUID\",\n    vpc_flow.dst_endpoint.vpc_uid AS \"VPCUID\",\n    vpc_flow.dst_endpoint.subnet_uid AS \"SubnetUID\",\n    vpc_flow.disposition,\n    vpc_flow.connection_info.direction AS \"direction\",\n    vpc_flow.connection_info.protocol_num AS \"ProtocolNum\",\n    vpc_flow.connection_info.tcp_flags AS \"TCPFlags\",\n    TopIps.TotalBytes\nFROM TopIps\nJOIN \"test_database_name\".\"test_datatable_name\" vpc_flow\nON TopIps.DestinationIP = vpc_flow.dst_endpoint.ip\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY AND CURRENT_TIMESTAMP\n    AND connection_info.direction = 'Outbound'\n)\nSELECT vpcLogs.*\nFROM (\n    SELECT *,\n           ROW_NUMBER() OVER (PARTITION BY DestinationIP ORDER BY bytes ) AS row_num\n    FROM TopIpsWithRows\n) vpcLogs\nWHERE vpcLogs.row_num <= 25",
            Columns: [
                {
                    Name: "bytes",
                    Type: "INTEGER"
                },
                {
                    Name: "accountid",
                    Type: "STRING"
                },
                {
                    Name: "region",
                    Type: "STRING"
                },
                {
                    Name: "zone",
                    Type: "STRING"
                },
                {
                    Name: "DestinationPort",
                    Type: "INTEGER"
                },
                {
                    Name: "DestinationIP",
                    Type: "STRING"
                },
                {
                    Name: "InterfaceUID",
                    Type: "STRING"
                },
                {
                    Name: "VPCUID",
                    Type: "STRING"
                },
                {
                    Name: "SubnetUID",
                    Type: "STRING"
                },
                {
                    Name: "disposition",
                    Type: "STRING"
                },
                {
                    Name: "direction",
                    Type: "STRING"
                },
                {
                    Name: "ProtocolNum",
                    Type: "INTEGER"
                },
                {
                    Name: "TCPFlags",
                    Type: "INTEGER"
                },
                {
                    Name: "TotalBytes",
                    Type: "INTEGER"
                },
                {
                    Name: "row_num",
                    Type: "INTEGER"
                }
            ]
        },
    },
  },
  LogicalTableMap: {
    '9af48d85-a269-49e7-a031-5fcb09374936': {
      Alias: 'Security_Insights_Vpc_Flow_Destination_Outbound',
      DataTransforms: [
        {
          ProjectOperation: {
            ProjectedColumns: [
                "bytes",
                "accountid",
                "region",
                "zone",
                "DestinationPort",
                "DestinationIP",
                "InterfaceUID",
                "VPCUID",
                "SubnetUID",
                "disposition",
                "direction",
                "ProtocolNum",
                "TCPFlags",
                "TotalBytes",
                "row_num"
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
        Name: "bytes",
        Type: "INTEGER"
    },
    {
        Name: "accountid",
        Type: "STRING"
    },
    {
        Name: "region",
        Type: "STRING"
    },
    {
        Name: "zone",
        Type: "STRING"
    },
    {
        Name: "DestinationPort",
        Type: "INTEGER"
    },
    {
        Name: "DestinationIP",
        Type: "STRING"
    },
    {
        Name: "InterfaceUID",
        Type: "STRING"
    },
    {
        Name: "VPCUID",
        Type: "STRING"
    },
    {
        Name: "SubnetUID",
        Type: "STRING"
    },
    {
        Name: "disposition",
        Type: "STRING"
    },
    {
        Name: "direction",
        Type: "STRING"
    },
    {
        Name: "ProtocolNum",
        Type: "INTEGER"
    },
    {
        Name: "TCPFlags",
        Type: "INTEGER"
    },
    {
        Name: "TotalBytes",
        Type: "INTEGER"
    },
    {
        Name: "row_num",
        Type: "INTEGER"
    }
    ],
  DataSetUsageConfiguration: {
    DisableUseAsDirectQuerySource: false,
    DisableUseAsImportedSource: false,
  },
};
