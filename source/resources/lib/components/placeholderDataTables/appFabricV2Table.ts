// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Schema } from '@aws-cdk/aws-glue-alpha';
import { DEFAULT_APP_FABRIC_TABLE_NAME } from './constants';

export const glueDataTable = {
  tableName: DEFAULT_APP_FABRIC_TABLE_NAME,
  s3Prefix: 'appfabric/',
  columns: [
    {
      name: 'activity_id',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'activity_name',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'actor',
      //type: "struct<session:struct<created_time:bigint,uid:string,issuer:string>,user:struct<uid:string,email_addr:string,credential_uid:string,name:string,type:string>>",
      type: Schema.struct([
        {
          name: 'session',
          type: Schema.struct([
            {
              name: 'created_time',
              type: Schema.BIG_INT,
            },
            {
              name: 'uid',
              type: Schema.STRING,
            },
            {
              name: 'issuer',
              type: Schema.STRING,
            },
          ]),
        },
        {
          name: 'user',
          type: Schema.struct([
            {
              name: 'uid',
              type: Schema.STRING,
            },
            {
              name: 'email_addr',
              type: Schema.STRING,
            },
            {
              name: 'credential_uid',
              type: Schema.STRING,
            },
            {
              name: 'name',
              type: Schema.STRING,
            },
            {
              name: 'type',
              type: Schema.STRING,
            },
          ]),
        },
      ]),
    },
    {
      name: 'user',
      //type: "struct<uid:string,email_addr:string,credential_uid:string,name:string,type:string>",
      type: Schema.struct([
        {
          name: 'uid',
          type: Schema.STRING,
        },
        {
          name: 'email_addr',
          type: Schema.STRING,
        },
        {
          name: 'credential_uid',
          type: Schema.STRING,
        },
        {
          name: 'name',
          type: Schema.STRING,
        },
        {
          name: 'type',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'group',
      //type: "struct<uid:string,desc:string,name:string,type:string,privileges:array<string>>",
      type: Schema.struct([
        {
          name: 'uid',
          type: Schema.STRING,
        },
        {
          name: 'desc',
          type: Schema.STRING,
        },
        {
          name: 'name',
          type: Schema.STRING,
        },
        {
          name: 'type',
          type: Schema.STRING,
        },
        {
          name: 'privileges',
          type: Schema.array(Schema.STRING),
        },
      ]),
      Comment: '',
    },
    {
      name: 'privileges',
      type: Schema.array(Schema.STRING),
      Comment: '',
    },
    {
      name: 'web_resources',
      //type: "array<struct<type:string,uid:string,name:string,data:struct<current_value:string,previous_value:string>>>",
      type: Schema.array(
        Schema.struct([
          {
            name: 'type',
            type: Schema.STRING,
          },
          {
            name: 'uid',
            type: Schema.STRING,
          },
          {
            name: 'name',
            type: Schema.STRING,
          },
          {
            name: 'data',
            type: Schema.struct([
              {
                name: 'current_value',
                type: Schema.STRING,
              },
              {
                name: 'previous_value',
                type: Schema.STRING,
              },
            ]),
          },
        ]),
      ),
      Comment: '',
    },
    {
      name: 'http_request',
      //type: "struct<http_method:string,user_agent:string,url:string>",
      type: Schema.struct([
        {
          name: 'http_method',
          type: Schema.STRING,
        },
        {
          name: 'user_agent',
          type: Schema.STRING,
        },
        {
          name: 'url',
          type: Schema.STRING,
        },
      ]),
      Comment: '',
    },
    {
      name: 'auth_protocol',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'auth_protocol_id',
      type: Schema.INTEGER,
      Comment: '',
    },
    {
      name: 'category_name',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'category_uid',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'class_name',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'class_uid',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'is_mfa',
      type: Schema.BOOLEAN,
      Comment: '',
    },
    {
      name: 'raw_data',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'severity',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'severity_id',
      type: Schema.INTEGER,
      Comment: '',
    },
    {
      name: 'status',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'status_detail',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'status_id',
      type: Schema.INTEGER,
      Comment: '',
    },
    {
      name: 'time',
      type: Schema.BIG_INT,
      Comment: '',
    },
    {
      name: 'type_name',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'type_uid',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'description',
      type: Schema.STRING,
      Comment: '',
    },
    {
      name: 'metadata',
      //type: "struct<product:struct<uid:string,vendor_name:string,name:string>,processed_time:string,version:string,uid:string,event_code:string>",
      type: Schema.struct([
        {
          name: 'product',
          type: Schema.struct([
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
          name: 'processed_time',
          type: Schema.STRING,
        },
        {
          name: 'version',
          type: Schema.STRING,
        },
        {
          name: 'uid',
          type: Schema.STRING,
        },
        {
          name: 'event_code',
          type: Schema.STRING,
        },
      ]),
      Comment: '',
    },
    {
      name: 'device',
      //type: "struct<uid:string,hostname:string,ip:string,name:string,region:string,type:string,os:struct<name:string,type:string,version:string>,location:struct<coordinates:array<float>,city:string,state:string,country:string,postal_code:string,continent:string,desc:string>>",
      type: Schema.struct([
        {
          name: 'uid',
          type: Schema.STRING,
        },
        {
          name: 'hostname',
          type: Schema.STRING,
        },
        {
          name: 'ip',
          type: Schema.STRING,
        },
        {
          name: 'name',
          type: Schema.STRING,
        },
        {
          name: 'region',
          type: Schema.STRING,
        },
        {
          name: 'type',
          type: Schema.STRING,
        },
        {
          name: 'os',
          type: Schema.struct([
            {
              name: 'name',
              type: Schema.STRING,
            },
            {
              name: 'type',
              type: Schema.STRING,
            },
            {
              name: 'version',
              type: Schema.STRING,
            },
          ]),
        },
        {
          name: 'location',
          type: Schema.struct([
            {
              name: 'coordinates',
              type: Schema.array(Schema.FLOAT),
            },
            {
              name: 'city',
              type: Schema.STRING,
            },
            {
              name: 'state',
              type: Schema.STRING,
            },
            {
              name: 'country',
              type: Schema.STRING,
            },
            {
              name: 'postal_code',
              type: Schema.STRING,
            },
            {
              name: 'continent',
              type: Schema.STRING,
            },
            {
              name: 'desc',
              type: Schema.STRING,
            },
          ]),
        },
      ]),
      Comment: '',
    },
    {
      name: 'unmapped',
      type: Schema.map(Schema.STRING, Schema.STRING),
      Comment: '',
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
      name: 'eventday',
      type: Schema.STRING,
    },
  ],
};
