// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_UID_API_Failures',
    Name: 'Security_Insights_Cloudtrail_UID_API_Failures',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_Cloudtrail_UID_API_Failures",
          SqlQuery: "SELECT COUNT(*) AS \"Count\",\n\tactor.user.uid AS \"ActorUUID\",\n\tclass_name AS \"ClassName\",\n\tstatus\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\n\tAND class_name = 'API Activity'\n\tAND status = 'Failure'\nGROUP BY actor.user.uid,\n\tstatus,\n\tclass_name\nORDER BY COUNT(*) desc\nLIMIT 25",
          Columns: [
              {
                  Name: "Count",
                  Type: "INTEGER"
              },
              {
                  Name: "ActorUUID",
                  Type: "STRING"
              },
              {
                  Name: "ClassName",
                  Type: "STRING"
              },
              {
                  Name: "status",
                  Type: "STRING"
              }
          ]
      }
,
      },
    },
    LogicalTableMap: {
      '6bea002a-ef77-4a88-807a-004deed07d70': {
        Alias: 'Security_Insights_Cloudtrail_UID_API_Failures',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "Count",
                "ActorUUID",
                "ClassName",
                "status"
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
        Name: "ActorUUID",
        Type: "STRING"
    },
    {
        Name: "ClassName",
        Type: "STRING"
    },
    {
        Name: "status",
        Type: "STRING"
    }
    ],
    DataSetUsageConfiguration: {
      DisableUseAsDirectQuerySource: false,
      DisableUseAsImportedSource: false,
    },
  };
  