// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Schema } from '@aws-cdk/aws-glue-alpha';
import { DEFAULT_SECURITY_HUB_TABLE_NAME } from './constants';

export const glueDataTable = {
  tableName: DEFAULT_SECURITY_HUB_TABLE_NAME,
  s3Prefix: 'sh/',
  columns: [
    {
      name: 'metadata',
      //type: "struct<product:struct<version:string,feature:struct<uid:string,name:string>,uid:string,vendor_name:string,name:string>,profiles:array<string>,version:string>"
      type: Schema.struct([
        {
          name: 'product',
          type: Schema.struct([
            {
              name: 'version',
              type: Schema.STRING,
            },
            {
              name: 'feature',
              type: Schema.struct([
                {
                  name: 'uid',
                  type: Schema.STRING,
                },
                {
                  name: 'name',
                  type: Schema.STRING,
                },
              ]),
            },
            {
              name: 'uid',
              type: Schema.STRING,
            },
            {
              name: 'vendor_name',
              type: Schema.STRING,
            },
            {
              name: 'name',
              type: Schema.STRING,
            },
          ]),
        },
        {
          name: 'processed_time_dt',
          type: Schema.array(Schema.TIMESTAMP),
        },
        {
          name: 'profiles',
          type: Schema.array(Schema.STRING),
        },
        {
          name: 'version',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'time',
      type: Schema.BIG_INT,
    },
    {
      name: 'confidence_score',
      type: Schema.INTEGER

    },
    {
      name: 'cloud',
      //type: "struct<account_uid:string,region:string,provider:string>"
      type: Schema.struct([
        {
          name: 'account_uid',
          type: Schema.STRING,
        },
        {
          name: 'region',
          type: Schema.STRING,
        },
        {
          name: 'provider',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'resource',
      //type: "array<struct<type:string,uid:string,cloud_partition:string,region:string,labels:array<string>,details:string,criticality:string>>"
      type: Schema.struct([
          {
            name: 'type',
            type: Schema.STRING,
          },
          {
            name: 'uid',
            type: Schema.STRING,
          },
          {
            name: 'cloud_partition',
            type: Schema.STRING,
          },
          {
            name: 'region',
            type: Schema.STRING,
          },
          {
            name: 'labels',
            type: Schema.array(Schema.STRING),
          },
          {
            name: 'details',
            type: Schema.STRING,
          },
          {
            name: 'criticality',
            type: Schema.STRING,
          },
        ]),
    },
    {
      name: 'resources',
      type: Schema.array(
        Schema.struct([
          {
            name: 'type',
            type: Schema.STRING
          },
          {
            name: 'uid',
            type: Schema.STRING
          },
          {
            name: 'cloud_partition',
            type: Schema.STRING
          },
          {
            name: 'region',
            type: Schema.STRING
          },
          {
            name: 'labels',
            type: Schema.array(Schema.STRING)
          },
          {
            name: 'data',
            type: Schema.STRING
          },
          {
            name: 'criticality',
            type: Schema.STRING
          }
        ])
      )
    },
    {
      name: 'finding_info',
      //type: "struct<created_time:bigint,uid:string,desc:string,title:string,modified_time:bigint,first_seen_time:bigint,last_seen_time:bigint,related_events:array<struct<product_uid:string,uid:string>>,types:array<string>,remediation:struct<desc:string,kb_articles:array<string>>,src_url:string>"
      type: Schema.struct([
        {
          name: 'created_time_dt',
          type: Schema.TIMESTAMP,
        },
        {
          name: 'uid',
          type: Schema.STRING,
        },
        {
          name: 'desc',
          type: Schema.STRING,
        },
        {
          name: 'title',
          type: Schema.STRING,
        },
        {
          name: 'modified_time_dt',
          type: Schema.TIMESTAMP,
        },
        {
          name: 'first_seen_time_dt',
          type: Schema.TIMESTAMP,
        },
        {
          name: 'last_seen_time_dt',
          type: Schema.TIMESTAMP,
        },
        {
          name: 'related_events',
          type: Schema.array(
            Schema.struct([
              {
                name: 'product_uid',
                type: Schema.STRING,
              },
              {
                name: 'uid',
                type: Schema.STRING,
              },
            ]),
          ),
        },
        {
          name: 'types',
          type: Schema.array(Schema.STRING),
        },
        {
          name: 'remediation',
          type: Schema.struct([
            {
              name: 'desc',
              type: Schema.STRING,
            },
            {
              name: 'kb_articles',
              type: Schema.array(Schema.STRING),
            },
          ]),
        },
        {
          name: 'src_url',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'compliance',
      //type: "struct<status:string,requirements:array<string>,status_detail:string>"
      type: Schema.struct([
        {
          name: 'standards',
          type:Schema.array(Schema.STRING)
        },
        {
          name: 'control',
          type: Schema.STRING,
        },
        {
          name: 'status',
          type: Schema.STRING,
        },
        {
          name: 'status_code',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'malware',
      //type: "array<struct<name:string,path:string,classification_ids:array<int>,classifications:array<string>>>"
      type: Schema.array(
        Schema.struct([
          {
            name: 'name',
            type: Schema.STRING,
          },
          {
            name: 'path',
            type: Schema.STRING,
          },
          {
            name: 'classification_ids',
            type: Schema.array(Schema.INTEGER),
          },
          {
            name: 'classifications',
            type: Schema.array(Schema.STRING),
          },
        ]),
      ),
    },
    {
      name: 'process',
      //type: "struct<name:string,pid:int,file:struct<path:string,type_id:int,name:string>,parent_process:struct<pid:int>,created_time:bigint,terminated_time:bigint>"
      type: Schema.struct([
        {
          name: 'name',
          type: Schema.STRING,
        },
        {
          name: 'pid',
          type: Schema.INTEGER,
        },
        {
          name: 'file',
          type: Schema.struct([
            {
              name: 'path',
              type: Schema.STRING,
            },
            {
              name: 'type_id',
              type: Schema.INTEGER,
            },
            {
              name: 'name',
              type: Schema.STRING,
            },
          ]),
        },
        {
          name: 'parent_process',
          type: Schema.struct([
            {
              name: 'pid',
              type: Schema.INTEGER,
            },
          ]),
        },
        {
          name: 'created_time',
          type: Schema.BIG_INT,
        },
        {
          name: 'terminated_time',
          type: Schema.BIG_INT,
        },
      ]),
    },
    {
      name: 'vulnerabilities',
      //type: "array<struct<cve:struct<cvss:struct<base_score:float,vector_string:string,version:string>,uid:string,created_time:bigint,modified_time:bigint>,references:array<string>,related_vulnerabilities:array<string>,vendor_name:string,kb_articles:array<string>,packages:array<struct<architecture:string,name:string,epoch:int,release:string,version:string>>>>"
      type: Schema.array(
        Schema.struct([
          {
            name: 'cve',
            type: Schema.struct([
              {
                name: 'cvss',
                type: Schema.struct([
                  {
                    name: 'base_score',
                    type: Schema.FLOAT,
                  },
                  {
                    name: 'vector_string',
                    type: Schema.STRING,
                  },
                  {
                    name: 'version',
                    type: Schema.STRING,
                  },
                ]),
              },
              {
                name: 'uid',
                type: Schema.STRING,
              },
              {
                name: 'created_time',
                type: Schema.BIG_INT,
              },
              {
                name: 'modified_time',
                type: Schema.BIG_INT,
              },
            ]),
          },
          {
            name: 'references',
            type: Schema.array(Schema.STRING),
          },
          {
            name: 'related_vulnerabilities',
            type: Schema.array(Schema.STRING),
          },
          {
            name: 'vendor_name',
            type: Schema.STRING,
          },
          {
            name: 'kb_articles',
            type: Schema.array(Schema.STRING),
          },
          {
            name: 'packages',
            type: Schema.array(
              Schema.struct([
                {
                  name: 'architecture',
                  type: Schema.STRING,
                },
                {
                  name: 'name',
                  type: Schema.STRING,
                },
                {
                  name: 'epoch',
                  type: Schema.INTEGER,
                },
                {
                  name: 'release',
                  type: Schema.STRING,
                },
                {
                  name: 'version',
                  type: Schema.STRING,
                },
              ]),
            ),
          },
        ]),
      ),
    },
    {
      name: 'class_name',
      type: Schema.STRING,
    },
    {
      name: 'class_uid',
      type: Schema.INTEGER,
    },
    {
      name: 'category_name',
      type: Schema.STRING,
    },
    {
      name: 'category_uid',
      type: Schema.INTEGER,
    },
    {
      name: 'severity_id',
      type: Schema.INTEGER,
    },
    {
      name: 'severity',
      type: Schema.STRING,
    },
    {
      name: 'activity_name',
      type: Schema.STRING,
    },
    {
      name: 'activity_id',
      type: Schema.INTEGER,
    },
    {
      name: 'type_uid',
      type: Schema.INTEGER,
    },
    {
      name: 'type_name',
      type: Schema.STRING,
    },
    {
      name: 'state_id',
      type: Schema.INTEGER,
    },
    {
      name: 'state',
      type: Schema.STRING,
    },
    {
      name: 'unmapped',
      //type: "map<string,string>"
      type: Schema.map(Schema.STRING, Schema.STRING),
    },
    {
      name: 'region',
      type: Schema.STRING,
    },
    {
      name: 'accountid',
      type: Schema.STRING,
    },
    {
      name: 'status',
      type: Schema.STRING,
    },
    {
      name: 'time_dt',
      type: Schema.TIMESTAMP,
    },
    {
      name: 'observables',
      type: Schema.array(
        Schema.struct([
          {
            name: 'name',
            type: Schema.STRING
          },
          {
            name: 'value',
            type: Schema.STRING
          },
          {
            name: 'type',
            type: Schema.STRING
          },
          {
            name: 'type_id',
            type: Schema.INTEGER
          }
        ])
      )
    }
  ],
};
