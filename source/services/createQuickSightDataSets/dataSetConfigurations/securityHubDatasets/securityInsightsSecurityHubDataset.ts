// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const dataset = {
  DataSetId: 'Security_Insights_Security_Hub_Dataset',
  Name: 'Security_Insights_Security_Hub_Dataset',
  PhysicalTableMap: {
    '60ace416-784e-4798-8766-58bf09b9faaf': {
      CustomSql: {
        DataSourceArn: "test",
        Name: "Security_Insights_Security_Hub_Dataset",
        SqlQuery: "with findings as \n(\n    SELECT \n\n    metadata.product.feature.uid as UID,\n    metadata.product.name as Product_Name,\n    metadata.product.vendor_name as Product_Vendor_Name,\n    metadata.processed_time_dt as Processed_Timestamp,\n    time_dt as Timestamp,\n    confidence_score as Confidence_Score,\n    cloud.provider as Cloud_Provider,\n\n    IF (resource is not NULL,\n        ARRAY[resource.type],\n        if (Resources is not NULL,\n        TRANSFORM(\n            cast(resources as ARRAY<JSON>),\n            x -> JSON_EXTRACT_SCALAR(x, '$.type')\n        ),\n        NULL\n        )\n    ) as Resource_Types,\n    \n    IF (resource is not NULL,\n        resource.criticality,\n        if (Resources is not NULL,\n            array_join(\n                TRANSFORM(\n                    cast(resources as ARRAY<JSON>),\n                    x -> JSON_EXTRACT_SCALAR(x, '$.criticality')\n                ),\n                ','\n                ),\n            NULL\n        )\n    ) as Criticality,\n    \n\n    finding_info.created_time_dt as Created_Timestamp,\n    finding_info.title as Title,\n    finding_info.first_seen_time_dt as First_Seen_Timestamp,\n    finding_info.last_seen_time_dt as Last_Seen_Timestamp,\n    \n    compliance.standards as Compliance_Standards,\n    compliance.control as Compliance_Control,\n    compliance.status as Compliance_Status,\n    compliance.status_code as Compliance_Status_Code,\n    \n    class_name as Class,\n    category_name as Category,\n    activity_name as Activity,\n    type_name as Type,\n    severity as Severity,\n    status as Status,\n    accountid as Account_Id,\n    region as Region,\n    \n    array_join(\n        TRANSFORM(\n            cast(observables as ARRAY<JSON>),\n            x ->\n            IF(\n                JSON_EXTRACT_SCALAR(x, '$.type_id') = '1',\n                JSON_EXTRACT_SCALAR(x, '$.value'),\n                NULL\n            )\n        ) , \n        ','\n    ) as Host_Name,\n\n    array_join(\n        TRANSFORM(\n            cast(observables as ARRAY<JSON>),\n            x ->\n            IF(\n                JSON_EXTRACT_SCALAR(x, '$.type_id') = '2',\n                JSON_EXTRACT_SCALAR(x, '$.value'),\n                NULL\n            )\n        ) , \n        ','\n    ) as Ip_Address,\n    \n    array_join(\n        filter(\n            TRANSFORM(\n                cast(observables as ARRAY<JSON>),\n                x ->\n                IF(\n                    JSON_EXTRACT_SCALAR(x, '$.type_id') = '4',\n                    JSON_EXTRACT_SCALAR(x, '$.value'),\n                    NULL\n                )\n            ),\n            x -> x is not null\n        ),\n        ','\n    ) as User_Name,\n    \n    array_join(\n        filter(\n            TRANSFORM(\n                cast(observables as ARRAY<JSON>),\n                x ->\n                IF(\n                    JSON_EXTRACT_SCALAR(x, '$.type_id') = '5',\n                    JSON_EXTRACT_SCALAR(x, '$.value'),\n                    NULL\n                )\n            ),\n            x -> x is not null\n        ),\n        ','\n    ) as Email_Address,\n    \n    array_join(\n        filter(\n            TRANSFORM(\n                cast(observables as ARRAY<JSON>),\n                x ->\n                IF(\n                    JSON_EXTRACT_SCALAR(x, '$.type_id') = '20',\n                    JSON_EXTRACT_SCALAR(x, '$.value'),\n                    NULL\n                )\n            ),\n            x -> x is not null\n        ),\n        ','\n    ) as End_Point,\n    \n    array_join(\n        filter(\n            TRANSFORM(\n                cast(observables as ARRAY<JSON>),\n                x ->\n                IF(\n                    JSON_EXTRACT_SCALAR(x, '$.type_id') = '26',\n                    JSON_EXTRACT_SCALAR(x, '$.value'),\n                    NULL\n                )\n            ),\n            x -> x is not null\n        ),\n        ','\n    ) as Geo_Location,\n    \n\n    Unmapped['WorkflowState'] as Workflow_State,\n    Unmapped['RecordState'] as Record_State,\n    unmapped['ProductFields.aws/securityhub/FindingId'] as Finding_Id\n\n\n\n    FROM \"test_database_name\".\"test_datatable_name\" \n    WHERE (time_dt BETWEEN (current_timestamp - INTERVAL  'query_window_duration' DAY) AND (current_timestamp - INTERVAL  '1' DAY))\n),\nfindings_sorted as\n(\n    select\n     *, row_number() OVER(PARTITION BY Finding_Id ORDER BY Timestamp DESC) rn\n    from\n    findings\n),\nfindings_deduped as\n(\n    select * from findings_sorted\n    where rn = 1\n)\nselect\nProduct_Name,\nProduct_Vendor_Name,\nProcessed_Timestamp,\nTimestamp,\nConfidence_Score,\nCloud_Provider,\nResource_Types,\nCreated_Timestamp,\nTitle,\nFirst_Seen_Timestamp,\nLast_Seen_Timestamp,\nCompliance_Standards,\nCompliance_Control,\nCompliance_Status,\nCompliance_Status_Code,\nClass,\nCategory,\nActivity,\nUID,\nType,\nSeverity,\nStatus,\nAccount_Id,\nRegion,\nHost_Name,\nIp_Address,\nUser_Name,\nEmail_Address,\nEnd_Point,\nGeo_Location,\nWorkflow_State,\nRecord_State,\nFinding_Id,\nResource_Type,\nCompliance_Standard\nfrom findings_deduped \n    LEFT JOIN UNNEST(Resource_Types) as t(Resource_Type) ON TRUE\n    LEFT JOIN UNNEST(Compliance_Standards) as t(Compliance_Standard) ON TRUE",
        Columns: [
            {
                Name: "Product_Name",
                Type: "STRING"
            },
            {
                Name: "Product_Vendor_Name",
                Type: "STRING"
            },
            {
                Name: "Processed_Timestamp",
                Type: "DATETIME"
            },
            {
                Name: "Timestamp",
                Type: "DATETIME"
            },
            {
                Name: "Confidence_Score",
                Type: "INTEGER"
            },
            {
                Name: "Cloud_Provider",
                Type: "STRING"
            },
            {
                Name: "Created_Timestamp",
                Type: "DATETIME"
            },
            {
                Name: "Title",
                Type: "STRING"
            },
            {
                Name: "First_Seen_Timestamp",
                Type: "DATETIME"
            },
            {
                Name: "Last_Seen_Timestamp",
                Type: "DATETIME"
            },
            {
                Name: "Compliance_Control",
                Type: "STRING"
            },
            {
                Name: "Compliance_Status",
                Type: "STRING"
            },
            {
                Name: "Compliance_Status_Code",
                Type: "STRING"
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
                Name: "Host_Name",
                Type: "STRING"
            },
            {
                Name: "Ip_Address",
                Type: "STRING"
            },
            {
                Name: "User_Name",
                Type: "STRING"
            },
            {
                Name: "Email_Address",
                Type: "STRING"
            },
            {
                Name: "End_Point",
                Type: "STRING"
            },
            {
                Name: "Geo_Location",
                Type: "STRING"
            },
            {
                Name: "Workflow_State",
                Type: "STRING"
            },
            {
                Name: "Record_State",
                Type: "STRING"
            },
            {
                Name: "Finding_Id",
                Type: "STRING"
            },
            {
                Name: "Resource_Type",
                Type: "STRING"
            },
            {
                Name: "Compliance_Standard",
                Type: "STRING"
            },
            {
                Name: "UID",
                Type: "STRING"
            }
        ]
    }

,
    },
  },
  LogicalTableMap: {
    '0316e9e9-049e-4089-90b4-b9442e560294': {
      Alias: 'Security_Insights_Security_Hub_Dataset',
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
        Name: "Product_Name",
        Type: "STRING"
    },
    {
        Name: "Product_Vendor_Name",
        Type: "STRING"
    },
    {
        Name: "Processed_Timestamp",
        Type: "DATETIME"
    },
    {
        Name: "Timestamp",
        Type: "DATETIME"
    },
    {
        Name: "Confidence_Score",
        Type: "INTEGER"
    },
    {
        Name: "Cloud_Provider",
        Type: "STRING"
    },
    {
        Name: "Created_Timestamp",
        Type: "DATETIME"
    },
    {
        Name: "Title",
        Type: "STRING"
    },
    {
        Name: "First_Seen_Timestamp",
        Type: "DATETIME"
    },
    {
        Name: "Last_Seen_Timestamp",
        Type: "DATETIME"
    },
    {
        Name: "Compliance_Control",
        Type: "STRING"
    },
    {
        Name: "Compliance_Status",
        Type: "STRING"
    },
    {
        Name: "Compliance_Status_Code",
        Type: "STRING"
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
        Name: "Host_Name",
        Type: "STRING"
    },
    {
        Name: "Ip_Address",
        Type: "STRING"
    },
    {
        Name: "User_Name",
        Type: "STRING"
    },
    {
        Name: "Email_Address",
        Type: "STRING"
    },
    {
        Name: "End_Point",
        Type: "STRING"
    },
    {
        Name: "Geo_Location",
        Type: "STRING"
    },
    {
        Name: "Workflow_State",
        Type: "STRING"
    },
    {
        Name: "Record_State",
        Type: "STRING"
    },
    {
        Name: "Finding_Id",
        Type: "STRING"
    },
    {
        Name: "Resource_Type",
        Type: "STRING"
    },
    {
        Name: "Compliance_Standard",
        Type: "STRING"
    },
    {
        Name: "UID",
        Type: "STRING"
    }
],
  DataSetUsageConfiguration: {
    DisableUseAsDirectQuerySource: false,
    DisableUseAsImportedSource: false,
  },
};
