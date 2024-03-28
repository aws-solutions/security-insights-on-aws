// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_Operation_Details',
    Name: 'Security_Insights_Cloudtrail_Operation_Details',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
            DataSourceArn: 'test',
            Name: "Security_Insights_Cloudtrail_Operation_Details",
            SqlQuery: "SELECT vpc.*\nFROM (\n\t\tSELECT api.operation AS \"ActivityType\",\n\t\t\tstatus AS \"Status\",\n\t\t\tregion AS \"Region\",\n\t\t\taccountid AS \"AccountId\",\n\t\t\tapi.request.uid AS \"ApiRequestID\",\n\t\t\tROW_NUMBER() OVER (\n\t\t\t\tPARTITION BY api.operation,\n\t\t\t\tstatus,\n\t\t\t\taccountid,\n\t\t\t\tregion\n\t\t\t) AS row_num\n\t\tFROM \"test_database_name\".\"test_datatable_name\"\n\t\tWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\t\t\tAND CURRENT_TIMESTAMP\n\t\t\tAND (\n\t\t\t\tapi.operation in (\n\t\t\t\t\t'ModifySecurityGroupRules',\n\t\t\t\t\t'AuthorizeSecurityGroupEgress',\n\t\t\t\t\t'AuthorizeSecurityGroupIngress',\n\t\t\t\t\t'DescribeSecurityGroupRules',\n\t\t\t\t\t'RevokeSecurityGroupEgress',\n\t\t\t\t\t'RevokeSecurityGroupIngress',\n\t\t\t\t\t'UpdateSecurityGroupRuleDescriptionsEgress',\n\t\t\t\t\t'UpdateSecurityGroupRuleDescriptionsIngress',\n\t\t\t\t\t'CreateNetworkAcl',\n\t\t\t\t\t'CreateNetworkAclEntry',\n\t\t\t\t\t'DeleteNetworkAcl',\n\t\t\t\t\t'DeleteNetworkAclEntry',\n\t\t\t\t\t'DescribeNetworkAcls',\n\t\t\t\t\t'ReplaceNetworkAclAssociation',\n\t\t\t\t\t'ReplaceNetworkAclEntry',\n\t\t\t\t\t'CreateLocalGatewayRouteTable',\n\t\t\t\t\t'AssociateRouteTable',\n\t\t\t\t\t'CreateLocalGatewayRouteTable',\n\t\t\t\t\t'CreateTransitGatewayRouteTable',\n\t\t\t\t\t'DeleteLocalGatewayRouteTable',\n\t\t\t\t\t'DeleteRouteTable',\n\t\t\t\t\t'DeleteTransitGatewayRouteTable',\n\t\t\t\t\t'DescribeRouteTables',\n\t\t\t\t\t'DisassociateRouteTable',\n\t\t\t\t\t'DisassociateTransitGatewayRouteTable',\n\t\t\t\t\t'CreateAccessKey',\n\t\t\t\t\t'UpdateAccessKey',\n\t\t\t\t\t'DeleteAccessKey',\n\t\t\t\t\t'PutKeyPolicy',\n\t\t\t\t\t'ScheduleKeyDeletion'\n\t\t\t\t)\n\t\t\t)\n\t) vpc\nWHERE vpc.row_num <= 25",
            Columns: [
                {
                    Name: "ActivityType",
                    Type: "STRING"
                },
                {
                    Name: "Status",
                    Type: "STRING"
                },
                {
                    Name: "Region",
                    Type: "STRING"
                },
                {
                    Name: "AccountId",
                    Type: "STRING"
                },
                {
                    Name: "ApiRequestID",
                    Type: "STRING"
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
      '6bea002a-ef77-4a88-807a-004deed07d70': {
        Alias: 'Security_Insights_Cloudtrail_Operation_Details',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "ActivityType",
                "Status",
                "Region",
                "AccountId",
                "ApiRequestID",
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
            Name: "ActivityType",
            Type: "STRING"
        },
        {
            Name: "Status",
            Type: "STRING"
        },
        {
            Name: "Region",
            Type: "STRING"
        },
        {
            Name: "AccountId",
            Type: "STRING"
        },
        {
            Name: "ApiRequestID",
            Type: "STRING"
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
  