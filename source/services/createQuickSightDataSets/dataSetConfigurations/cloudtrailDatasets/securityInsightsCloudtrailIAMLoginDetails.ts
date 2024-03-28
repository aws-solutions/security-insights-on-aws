// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_IAM_Login_Details',
    Name: 'Security_Insights_Cloudtrail_IAM_Login_Details',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_Cloudtrail_IAM_Login_Details",
          SqlQuery: "SELECT IamLogins.*\nFROM (\n\t\tSELECT accountid AS \"AccountID\",\n\t\t\tregion AS \"Region\",\n\t\t\tstatus AS \"ConsoleLoginStatus\",\n\t\t\thttp_request.user_agent AS \"UserAgent\",\n\t\t\tactor.user.type AS \"ActorType\",\n\t\t\tactor.user.uid AS \"UID\",\n\t\t\tcategory_name AS \"Category Name\",\n\t\t\tsrc_endpoint.ip AS \"Source IP\",\n\t\t\tCAST(is_mfa AS varchar) AS \"MFAUsed\",\n\t\t\tROW_NUMBER() OVER (\n\t\t\t\tPARTITION BY status,\n\t\t\t\tapi.operation,\n\t\t\t\tcategory_name,\n\t\t\t\tis_mfa\n\t\t\t) AS row_num\n\t\tFROM \"test_database_name\".\"test_datatable_name\"\n\t\tWHERE time_dt BETWEEN CURRENT_TIMESTAMP - INTERVAL 'query_window_duration' DAY\n\t\t\tAND CURRENT_TIMESTAMP\n\t\t\tAND api.operation = 'ConsoleLogin'\n\t\t\tAND category_name = 'Identity & Access Management'\n\t) IamLogins\nWHERE IamLogins.row_num <= 25",
          Columns: [
              {
                  Name: "AccountID",
                  Type: "STRING"
              },
              {
                  Name: "Region",
                  Type: "STRING"
              },
              {
                  Name: "ConsoleLoginStatus",
                  Type: "STRING"
              },
              {
                  Name: "UserAgent",
                  Type: "STRING"
              },
              {
                  Name: "ActorType",
                  Type: "STRING"
              },
              {
                  Name: "UID",
                  Type: "STRING"
              },
              {
                  Name: "Category Name",
                  Type: "STRING"
              },
              {
                  Name: "Source IP",
                  Type: "STRING"
              },
              {
                  Name: "MFAUsed",
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
        Alias: 'Security_Insights_Cloudtrail_IAM_Login_Details',
        DataTransforms: [
          {
            ProjectOperation: {
              ProjectedColumns: [
                "AccountID",
                "Region",
                "ConsoleLoginStatus",
                "UserAgent",
                "ActorType",
                "UID",
                "Category Name",
                "Source IP",
                "MFAUsed",
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
          Name: "AccountID",
          Type: "STRING"
      },
      {
          Name: "Region",
          Type: "STRING"
      },
      {
          Name: "ConsoleLoginStatus",
          Type: "STRING"
      },
      {
          Name: "UserAgent",
          Type: "STRING"
      },
      {
          Name: "ActorType",
          Type: "STRING"
      },
      {
          Name: "UID",
          Type: "STRING"
      },
      {
          Name: "Category Name",
          Type: "STRING"
      },
      {
          Name: "Source IP",
          Type: "STRING"
      },
      {
          Name: "MFAUsed",
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
  