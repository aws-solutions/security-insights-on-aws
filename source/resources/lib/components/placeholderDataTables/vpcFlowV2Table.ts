// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Schema } from '@aws-cdk/aws-glue-alpha';
import { DEFAULT_VPC_TABLE_NAME } from './constants';

export const glueDataTable = {
  tableName: DEFAULT_VPC_TABLE_NAME,
  s3Prefix: 'vpc/',
  columns: [
    {
      name: 'metadata',
      //type: "struct<product:struct<version:string,name:string,feature:struct<name:string>,vendor_name:string>,profiles:array<string>,version:string>"
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
              name: 'feature',
              type: Schema.struct([
                {
                  name: 'name',
                  type: Schema.STRING,
                },
              ]),
            },
            {
              name: 'vendor_name',
              type: Schema.STRING,
            },
          ]),
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
      name: 'cloud',
      //type: "struct<account_uid:string,region:string,zone:string,provider:string>"
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
          name: 'zone',
          type: Schema.STRING,
        },
        {
          name: 'provider',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'src_endpoint',
      //type: "struct<port:int,svc_name:string,ip:string,intermediate_ips:array<string>,interface_uid:string,vpc_uid:string,instance_uid:string,subnet_uid:string>"
      type: Schema.struct([
        {
          name: 'port',
          type: Schema.BIG_INT,
        },
        {
          name: 'svc_name',
          type: Schema.STRING,
        },
        {
          name: 'ip',
          type: Schema.STRING,
        },
        {
          name: 'intermediate_ips',
          type: Schema.array(Schema.STRING),
        },
        {
          name: 'interface_uid',
          type: Schema.STRING,
        },
        {
          name: 'vpc_uid',
          type: Schema.STRING,
        },
        {
          name: 'instance_uid',
          type: Schema.STRING,
        },
        {
          name: 'subnet_uid',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'dst_endpoint',
      //type: "struct<port:int,svc_name:string,ip:string,intermediate_ips:array<string>,interface_uid:string,vpc_uid:string,instance_uid:string,subnet_uid:string>"
      type: Schema.struct([
        {
          name: 'port',
          type: Schema.BIG_INT,
        },
        {
          name: 'svc_name',
          type: Schema.STRING,
        },
        {
          name: 'ip',
          type: Schema.STRING,
        },
        {
          name: 'intermediate_ips',
          type: Schema.array(Schema.STRING),
        },
        {
          name: 'interface_uid',
          type: Schema.STRING,
        },
        {
          name: 'vpc_uid',
          type: Schema.STRING,
        },
        {
          name: 'instance_uid',
          type: Schema.STRING,
        },
        {
          name: 'subnet_uid',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'connection_info',
      // type: "struct<protocol_num:int,tcp_flags:int,protocol_ver:string,boundary_id:int,boundary:string,direction_id:int,direction:string>"
      type: Schema.struct([
        {
          name: 'protocol_num',
          type: Schema.INTEGER,
        },
        {
          name: 'tcp_flags',
          type: Schema.INTEGER,
        },
        {
          name: 'protocol_ver',
          type: Schema.STRING,
        },
        {
          name: 'boundary_id',
          type: Schema.INTEGER,
        },
        {
          name: 'boundary',
          type: Schema.STRING,
        },
        {
          name: 'direction_id',
          type: Schema.INTEGER,
        },
        {
          name: 'direction',
          type: Schema.STRING,
        },
      ]),
    },
    {
      name: 'traffic',
      //type: "struct<packets:bigint,bytes:bigint>"
      type: Schema.struct([
        {
          name: 'packets',
          type: Schema.BIG_INT,
        },
        {
          name: 'bytes',
          type: Schema.BIG_INT,
        },
      ]),
    },
    {
      name: 'time',
      type: Schema.BIG_INT,
    },
    {
      name: 'start_time',
      type: Schema.BIG_INT,
    },
    {
      name: 'end_time',
      type: Schema.BIG_INT,
    },
    {
      name: 'status_code',
      type: Schema.STRING,
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
      name: 'activity_name',
      type: Schema.STRING,
    },
    {
      name: 'activity_id',
      type: Schema.INTEGER,
    },
    {
      name: 'disposition',
      type: Schema.STRING,
    },
    {
      name: 'disposition_id',
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
      name: 'time_dt',
      type: Schema.TIMESTAMP,
    },
  ],
};
