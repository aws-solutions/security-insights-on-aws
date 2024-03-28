// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_AppFabric_Suspicious_Logins',
    Name: 'Security_Insights_AppFabric_Suspicious_Logins',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_AppFabric_Suspicious_Logins",
          SqlQuery: "WITH consecutive_failures_count AS (\n  SELECT\n    from_unixtime(time/1000) as \"Time\",\n    status as \"Status\",\n    actor.user.uid as \"ActorID\",\n    metadata.product.name as \"ApplicationName\",\n    ROW_NUMBER() OVER (PARTITION BY metadata.product.name, actor.user.uid ORDER BY from_unixtime(time/1000)) AS row_num,\n    COUNT(*) OVER (PARTITION BY metadata.product.name, actor.user.uid ORDER BY from_unixtime(time/1000) \n                   RANGE BETWEEN INTERVAL '30' MINUTE PRECEDING AND CURRENT ROW) AS consecutive_failure_count\n  FROM \"test_database_name\".\"test_datatable_name\"\n  WHERE eventDay BETWEEN CAST(\n\t\tdate_format(current_timestamp - INTERVAL 'query_window_duration' day, '%Y%m%d%H') as varchar\n\t)\n\tand CAST(\n\t\tdate_format(current_timestamp - INTERVAL '0' day, '%Y%m%d%H') as varchar\n\t)\n  AND status = 'Failure'\n  AND activity_name = 'Logon'\n)\nSELECT\n  ApplicationName,\n  Time,\n  Status,\n  ActorID\nFROM\n  consecutive_failures_count\nWHERE\n  consecutive_failure_count = 3",
          Columns: [
              {
                  Name: "ApplicationName",
                  Type: "STRING"
              },
              {
                  Name: "Time",
                  Type: "DATETIME"
              },
              {
                  Name: "Status",
                  Type: "STRING"
              },
              {
                  Name: "ActorID",
                  Type: "STRING"
              }
          ]
      },
    },
    },
    LogicalTableMap: {
      '6bea002a-ef77-4a88-807a-004deed07d70': {
        Alias: 'Security_Insights_AppFabric_Suspicious_Logins',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "ApplicationName",
                "Time",
                "Status",
                "ActorID"
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
        Name: "ApplicationName",
        Type: "STRING"
      },
      {
          Name: "Time",
          Type: "DATETIME"
      },
      {
          Name: "Status",
          Type: "STRING"
      },
      {
          Name: "ActorID",
          Type: "STRING"
      }
    ],
    DataSetUsageConfiguration: {
      DisableUseAsDirectQuerySource: false,
      DisableUseAsImportedSource: false,
    },
  };
  