// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
    DataSetId: 'Security_Insights_Cloudtrail_Dataset',
    Name: 'Security_Insights_Cloudtrail_Dataset',
    PhysicalTableMap: {
      '60ace416-784e-4798-8766-58bf09b9faaf': {
        CustomSql: {
          DataSourceArn: "test",
          Name: "Security_Insights_Cloudtrail_Dataset",
          SqlQuery: "SELECT\n   uuid() as Record_Id,\n    metadata.product.name as Product_Name,\n    time_dt AS Timestamp,\n    metadata.event_code AS Event_Code,\n    api.operation AS Api_Operation,\n    cloud.provider as Cloud_Provider,\n    substr(api.service.name, 1, strpos(api.service.name, '.') - 1) AS Service,\n    actor.user.type AS Actor_User_Type, \n    actor.user.name AS Actor_User_Name,\n    actor.user.uid as Actor_UId,\n    user.name AS User_Name,\n    user.uid AS User_UId,\n    IF(actor.user.account.uid is NULL,        \n        'False',        \n        IF (actor.user.account.uid != accountid,\n            'True',\n            'False'\n        )\n    ) AS Is_Cross_Account,\n    http_request.user_agent AS User_Agent,\n    src_endpoint.ip AS Source_IP,\n    is_mfa AS MFA_Used,    \n    class_name as Class,\n    category_name as Category,\n    activity_name as Activity,\n    type_name as Type,\n    severity as Severity,\n    status as Status,\n    accountid as Account_Id,\n    region as Region,\n    \n    array_join(\n        filter(\n            TRANSFORM(\n                cast(observables as ARRAY<JSON>),\n                x ->\n                IF(\n                    JSON_EXTRACT_SCALAR(x, '$.type_id') = '5',\n                    JSON_EXTRACT_SCALAR(x, '$.value'),\n                    NULL\n                )\n            ),\n            x -> x is not null\n        ),\n        ','\n    ) as Email_Address,\n    \n    array_join(\n        filter(\n            TRANSFORM(\n                cast(observables as ARRAY<JSON>),\n                x ->\n                IF(\n                    JSON_EXTRACT_SCALAR(x, '$.type_id') = '26',\n                    JSON_EXTRACT_SCALAR(x, '$.value'),\n                    NULL\n                )\n            ),\n            x -> x is not null\n        ),\n        ','\n    ) as Geo_Location\nFROM \"test_database_name\".\"test_datatable_name\" \nWHERE (time_dt BETWEEN (current_timestamp - INTERVAL  'query_window_duration' DAY) AND (current_timestamp - INTERVAL  '1' DAY))",
          Columns: [
            {
                Name: "Record_Id",
                Type: "STRING"
            },
            {
                Name: "Product_Name",
                Type: "STRING"
            },
            {
                Name: "Timestamp",
                Type: "DATETIME"
            },
            {
                Name: "Event_Code",
                Type: "STRING"
            },
            {
                Name: "Api_Operation",
                Type: "STRING"
            },
            {
                Name: "Cloud_Provider",
                Type: "STRING"
            },
            {
                Name: "Service",
                Type: "STRING"
            },
            {
                Name: "Actor_User_Type",
                Type: "STRING"
            },
            {
                Name: "Actor_User_Name",
                Type: "STRING"
            },
            {
                Name: "Actor_UId",
                Type: "STRING"
            },
            {
                Name: "User_Name",
                Type: "STRING"
            },
            {
                Name: "User_UId",
                Type: "STRING"
            },
            {
                Name: "Is_Cross_Account",
                Type: "STRING"
            },
            {
                Name: "User_Agent",
                Type: "STRING"
            },
            {
                Name: "Source_IP",
                Type: "STRING"
            },
            {
                Name: "MFA_Used",
                Type: "BOOLEAN"
            },
            {
                Name: "Class",
                Type: "STRING"
            },
            {
                Name: "Category",
                Type: "STRING"
            },
            {
                Name: "Activity",
                Type: "STRING"
            },
            {
                Name: "Type",
                Type: "STRING"
            },
            {
                Name: "Severity",
                Type: "STRING"
            },
            {
                Name: "Status",
                Type: "STRING"
            },
            {
                Name: "Account_Id",
                Type: "STRING"
            },
            {
                Name: "Region",
                Type: "STRING"
            },
            {
                Name: "Email_Address",
                Type: "STRING"
            },
            {
                Name: "Geo_Location",
                Type: "STRING"
            }
        ]
      },
    },
    },
    LogicalTableMap: {
      '6bea002a-ef77-4a88-807a-004deed07d70': {
        Alias: 'Security_Insights_Cloudtrail_Dataset',
        DataTransforms: [
          {
            TagColumnOperation: {
                ColumnName: "Region",
                Tags: [
                    {
                        ColumnGeographicRole: "STATE"
                    }
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
            Name: "Record_Id",
            Type: "STRING"
        },
        {
            Name: "Product_Name",
            Type: "STRING"
        },
        {
            Name: "Timestamp",
            Type: "DATETIME"
        },
        {
            Name: "Event_Code",
            Type: "STRING"
        },
        {
            Name: "Api_Operation",
            Type: "STRING"
        },
        {
            Name: "Cloud_Provider",
            Type: "STRING"
        },
        {
            Name: "Service",
            Type: "STRING"
        },
        {
            Name: "Actor_User_Type",
            Type: "STRING"
        },
        {
            Name: "Actor_User_Name",
            Type: "STRING"
        },
        {
            Name: "Actor_UId",
            Type: "STRING"
        },
        {
            Name: "User_Name",
            Type: "STRING"
        },
        {
            Name: "User_UId",
            Type: "STRING"
        },
        {
            Name: "Is_Cross_Account",
            Type: "STRING"
        },
        {
            Name: "User_Agent",
            Type: "STRING"
        },
        {
            Name: "Source_IP",
            Type: "STRING"
        },
        {
            Name: "MFA_Used",
            Type: "INTEGER"
        },
        {
            Name: "Class",
            Type: "STRING"
        },
        {
            Name: "Category",
            Type: "STRING"
        },
        {
            Name: "Activity",
            Type: "STRING"
        },
        {
            Name: "Type",
            Type: "STRING"
        },
        {
            Name: "Severity",
            Type: "STRING"
        },
        {
            Name: "Status",
            Type: "STRING"
        },
        {
            Name: "Account_Id",
            Type: "STRING"
        },
        {
            Name: "Region",
            Type: "STRING"
        },
        {
            Name: "Email_Address",
            Type: "STRING"
        },
        {
            Name: "Geo_Location",
            Type: "STRING"
        },
        {
            Name: "Record_Id",
            Type: "STRING"
        }
    ],
    DataSetUsageConfiguration: {
      DisableUseAsDirectQuerySource: false,
      DisableUseAsImportedSource: false,
    },
  };
