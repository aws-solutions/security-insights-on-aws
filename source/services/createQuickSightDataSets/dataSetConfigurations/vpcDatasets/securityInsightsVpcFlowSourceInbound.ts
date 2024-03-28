// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Vpc_Flow_Source_Inbound',
    Name: 'Security_Insights_Vpc_Flow_Source_Inbound',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
            DataSourceArn: "test",
            Name: "Security_Insights_Vpc_Flow_Source_Inbound",
            SqlQuery: "WITH TopIps AS (\nSELECT SUM(traffic.bytes) AS \"TotalBytes\",\n    src_endpoint.ip AS \"SourceIP\",\n    connection_info.direction AS direction,\n    row_number() OVER (partition by src_endpoint.ip ORDER BY SUM(traffic.bytes) DESC) AS country_rank \nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY AND CURRENT_TIMESTAMP\n    and connection_info.direction = 'Inbound'\nGROUP BY src_endpoint.ip,\n    connection_info.direction\nORDER BY SUM(traffic.bytes) DESC\nLIMIT 25\n),\nTopIpsWithRows AS (\nSELECT\n    vpc_flow.traffic.bytes AS bytes,\n    vpc_flow.accountid,\n    vpc_flow.region,\n    vpc_flow.cloud.zone AS \"zone\",\n    vpc_flow.src_endpoint.port AS \"SourcePort\",\n    vpc_flow.src_endpoint.ip AS \"SourceIP\",\n    vpc_flow.src_endpoint.interface_uid AS \"InterfaceUID\",\n    vpc_flow.src_endpoint.vpc_uid AS \"VPCUID\",\n    vpc_flow.src_endpoint.subnet_uid AS \"SubnetUID\",\n    vpc_flow.disposition,\n    vpc_flow.connection_info.direction AS \"direction\",\n    vpc_flow.connection_info.protocol_num AS \"ProtocolNum\",\n    vpc_flow.connection_info.tcp_flags AS \"TCPFlags\",\n    TopIps.TotalBytes\nFROM TopIps\nJOIN \"test_database_name\".\"test_datatable_name\" vpc_flow\nON TopIps.SourceIP = vpc_flow.src_endpoint.ip\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY AND CURRENT_TIMESTAMP\n    and connection_info.direction = 'Inbound'\n)\n\nSELECT vpcLogs.*\nFROM (\n    SELECT *,\n           ROW_NUMBER() OVER (PARTITION BY SourceIP ORDER BY bytes ) AS row_num\n    FROM TopIpsWithRows\n) vpcLogs\nWHERE vpcLogs.row_num <= 25",
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
                    Name: "SourcePort",
                    Type: "INTEGER"
                },
                {
                    Name: "SourceIP",
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
        Alias: 'Security_Insights_Vpc_Flow_Source_Inbound',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "bytes",
                "accountid",
                "region",
                "zone",
                "SourcePort",
                "SourceIP",
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
            Name: "SourcePort",
            Type: "INTEGER"
        },
        {
            Name: "SourceIP",
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
  