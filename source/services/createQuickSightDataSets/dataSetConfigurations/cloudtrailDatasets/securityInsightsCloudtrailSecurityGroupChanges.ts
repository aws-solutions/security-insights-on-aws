// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_Security_Group_Changes',
    Name: 'Security_Insights_Cloudtrail_Security_Group_Changes',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_Cloudtrail_Security_Group_Changes",
          SqlQuery: "SELECT COUNT(*) AS \"Count\",\n\tapi.operation AS \"ActivityType\",\n\tstatus AS \"Status\"\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\n\tAND (\n\t\tapi.operation in (\n\t\t\t'ModifySecurityGroupRules',\n\t\t\t'AuthorizeSecurityGroupEgress',\n\t\t\t'AuthorizeSecurityGroupIngress',\n\t\t\t'DescribeSecurityGroupRules',\n\t\t\t'RevokeSecurityGroupEgress',\n\t\t\t'RevokeSecurityGroupIngress',\n\t\t\t'UpdateSecurityGroupRuleDescriptionsEgress',\n\t\t\t'UpdateSecurityGroupRuleDescriptionsIngress'\n\t\t)\n\t)\nGROUP BY api.operation,\n\tstatus",
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
        Alias: 'Security_Insights_Cloudtrail_Security_Group_Changes',
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
  