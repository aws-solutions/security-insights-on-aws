// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Vpc_Flow_Destination_Inbound',
    Name: 'Security_Insights_Vpc_Flow_Destination_Inbound',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
            DataSourceArn: "test",
            Name: "Security_Insights_Vpc_Flow_Destination_Inbound",
            SqlQuery: "WITH TopIps AS (\n\tSELECT SUM(traffic.bytes) AS \"TotalBytes\",\n\t\tdst_endpoint.ip AS \"DestinationIP\",\n\t\tconnection_info.direction AS direction,\n\t\trow_number() OVER (\n\t\t\tPARTITION BY dst_endpoint.ip\n\t\t\tORDER BY SUM(traffic.bytes) DESC\n\t\t) AS country_rank\n\tFROM \"test_database_name\".\"test_datatable_name\"\n\tWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\t\tAND CURRENT_TIMESTAMP\n\t\tAND connection_info.direction = 'Inbound'\n\tGROUP BY dst_endpoint.ip,\n\t\tconnection_info.direction\n\tORDER BY SUM(traffic.bytes) DESC\n\tLIMIT 25\n), TopIpsWithRows AS (\n\tSELECT vpc_flow.traffic.bytes AS bytes,\n\t\tvpc_flow.accountid,\n\t\tvpc_flow.region,\n\t\tvpc_flow.cloud.zone AS \"zone\",\n\t\tvpc_flow.dst_endpoint.port AS \"DestinationPort\",\n\t\tvpc_flow.dst_endpoint.ip AS \"DestinationIP\",\n\t\tvpc_flow.dst_endpoint.interface_uid AS \"InterfaceUID\",\n\t\tvpc_flow.dst_endpoint.vpc_uid AS \"VPCUID\",\n\t\tvpc_flow.dst_endpoint.subnet_uid AS \"SubnetUID\",\n\t\tvpc_flow.disposition,\n\t\tvpc_flow.connection_info.direction AS \"direction\",\n\t\tvpc_flow.connection_info.protocol_num AS \"ProtocolNum\",\n\t\tvpc_flow.connection_info.tcp_flags AS \"TCPFlags\",\n\t\tTopIps.TotalBytes\n\tFROM TopIps\n\t\tJOIN \"test_database_name\".\"test_datatable_name\" vpc_flow On TopIps.DestinationIP = vpc_flow.dst_endpoint.ip\n\tWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\t\tAND CURRENT_TIMESTAMP\n\t\tAND connection_info.direction = 'Inbound'\n)\nSELECT vpcLogs.*\nFROM (\n\t\tSELECT *,\n\t\t\tROW_NUMBER() OVER (\n\t\t\t\tPARTITION BY DestinationIP\n\t\t\t\tORDER BY bytes\n\t\t\t) AS row_num\n\t\tFROM TopIpsWithRows\n\t) vpcLogs\nWHERE vpcLogs.row_num <= 25",
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
        }
,
      },
    },
    LogicalTableMap: {
      '9af48d85-a269-49e7-a031-5fcb09374936': {
        Alias: 'Security_Insights_Vpc_Flow_Destination_Inbound',
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
  