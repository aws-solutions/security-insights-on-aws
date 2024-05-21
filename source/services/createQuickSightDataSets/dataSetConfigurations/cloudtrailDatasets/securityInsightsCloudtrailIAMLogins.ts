// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_IAM_Logins',
    Name: 'Security_Insights_Cloudtrail_IAM_Logins',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_Cloudtrail_IAM_Logins",
          SqlQuery: "SELECT status AS \"ConsoleLoginStatus\",\n\tCOUNT(*) AS \"Count\",\n\tCAST(is_mfa AS varchar) as \"MFAUsed\"\nFROM \"test_database_name\".\"test_datatable_name\"\nWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\tAND CURRENT_TIMESTAMP\n\tAND api.operation = 'ConsoleLogin'\n\tAND category_name = 'Identity & Access Management'\nGROUP BY status,\n\tis_mfa",
          Columns: [
              {
                  Name: "ConsoleLoginStatus",
                  Type: "STRING"
              },
              {
                  Name: "Count",
                  Type: "INTEGER"
              },
              {
                  Name: "MFAUsed",
                  Type: "STRING"
              }
          ]
      },
    },
    },
    LogicalTableMap: {
      '6bea002a-ef77-4a88-807a-004deed07d70': {
        Alias: 'Security_Insights_Cloudtrail_IAM_Logins',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "ConsoleLoginStatus",
                "Count",
                "MFAUsed"
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
        Name: "ConsoleLoginStatus",
        Type: "STRING"
      },
      {
          Name: "Count",
          Type: "INTEGER"
      },
      {
          Name: "MFAUsed",
          Type: "STRING"
      }
    ],
    DataSetUsageConfiguration: {
      DisableUseAsDirectQuerySource: false,
      DisableUseAsImportedSource: false,
    },
  };
  