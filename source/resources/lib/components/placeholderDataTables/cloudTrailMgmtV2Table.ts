// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Schema } from '@aws-cdk/aws-glue-alpha';
import { DEFAULT_CLOUDTRAIL_TABLE_NAME } from './constants';

export const glueDataTable = {
  tableName: DEFAULT_CLOUDTRAIL_TABLE_NAME,
  s3Prefix: 'cloudtrail/',
  columns: [
    {
      name: 'metadata',
      //type: "struct<product:struct<version:string,name:string,vendor_name:string,feature:struct<name:string>>,uid:string,profiles:array<string>,version:string>"
      type: Schema.struct([
        {
          name: 'product',
          type: Schema.struct([
            {
              name: 'version',
              type: Schema.STRING,
            },
            {
              name: 'name',
              type: Schema.STRING,
            },
            {
              name: 'vendor_name',
              type: Schema.STRING,
            },
            {
              name: 'feature',
              type: Schema.struct([
                {
                  name: 'name',
                  type: Schema.STRING,
                },
              ]),
            },
          ]),
        },
        {
          name: 'uid',
          type: Schema.STRING,
        },
        {
          name: 'event_code',
          type: Schema.STRING,
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
      name: 'cloud',
      //type: "struct<region:string,provider:string>",
      type: Schema.struct([
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
      name: 'api',
      //type: "struct<response:struct<error:string,message:string>,operation:string,version:string,service:struct<name:string>,request:struct<uid:string>>"
      type: Schema.struct([
        {
          name: 'response',
          type: Schema.struct([
            {
              name: 'error',
              type: Schema.STRING,
            },
            {
              name: 'message',
              type: Schema.STRING,
            },
          ]),
        },
        {
          name: 'operation',
          type: Schema.STRING,
        },
        {
          name: 'version',
          type: Schema.STRING,
        },
        {
          name: 'service',
          type: Schema.struct([
            {
              name: 'name',
              type: Schema.STRING,
            },
          ]),
        },
        {
          name: 'request',
          type: Schema.struct([
            {
              name: 'uid',
              type: Schema.STRING,
            },
          ]),
        },
      ]),
    },
    {
      name: 'dst_endpoint',
      //type: "struct<svc_name:string>"
      type: Schema.struct([
        {
          name: 'svc_name',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'actor',
      //type: "struct<user:struct<type:string,name:string,uid:string,uuid:string,account_uid:string,credential_uid:string>,session:struct<created_time:bigint,mfa:boolean,issuer:string>,invoked_by:string,idp:struct<name:string>>"
      type: Schema.struct([
        {
          name: 'user',
          type: Schema.struct([
            {
              name: 'type',
              type: Schema.STRING,
            },
            {
              name: 'name',
              type: Schema.STRING,
            },
            {
              name: 'uid',
              type: Schema.STRING,
            },
            {
              name: 'uuid',
              type: Schema.STRING,
            },
            {
              name: 'account',
              type: Schema.struct([
                {
                  name: 'uid',
                  type: Schema.STRING
                }

              ]),
            },
            {
              name: 'credential_uid',
              type: Schema.STRING,
            },
          ]),
        },
        {
          name: 'session',
          type: Schema.struct([
            {
              name: 'created_time',
              type: Schema.BIG_INT,
            },
            {
              name: 'is_mfa',
              type: Schema.BOOLEAN,
            },
            {
              name: 'issuer',
              type: Schema.STRING,
            },
          ]),
        },
        {
          name: 'invoked_by',
          type: Schema.STRING,
        },
        {
          name: 'idp',
          type: Schema.struct([
            {
              name: 'name',
              type: Schema.STRING,
            },
          ]),
        },
      ]),
    },
    {
      name: 'http_request',
      //type: "struct<user_agent:string>"
      type: Schema.struct([
        {
          name: 'user_agent',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'src_endpoint',
      //type: "struct<uid:string,ip:string,domain:string>"
      type: Schema.struct([
        {
          name: 'uid',
          type: Schema.STRING,
        },
        {
          name: 'ip',
          type: Schema.STRING,
        },
        {
          name: 'domain',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'resources',
      //type: "array<struct<uid:string,account_uid:string,type:string>>"
      type: Schema.array(
        Schema.struct([
          {
            name: 'uid',
            type: Schema.STRING,
          },
          {
            name: 'account_id',
            type: Schema.STRING,
          },
          {
            name: 'type',
            type: Schema.STRING,
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
      name: 'user',
      //type: "struct<uid:string,uuid:string,name:string>"
      type: Schema.struct([
        {
          name: 'uid',
          type: Schema.STRING,
        },
        {
          name: 'uuid',
          type: Schema.STRING,
        },
        {
          name: 'name',
          type: Schema.STRING,
        },
      ]),
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
      name: 'status',
      type: Schema.STRING,
    },
    {
      name: 'status_id',
      type: Schema.INTEGER,
    },
    {
      name: 'is_mfa',
      type: Schema.BOOLEAN,
    },
    {
      name: 'unmapped',
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
