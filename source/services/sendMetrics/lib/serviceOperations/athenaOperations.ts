// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AthenaClient, GetQueryExecutionCommand } from '@aws-sdk/client-athena';


export class AthenaOperations {
  constructor(private athenaClient: AthenaClient) {
    this.athenaClient = athenaClient;
  }

  public getQueryExecutionDetails = async (queryExecutionID: string) => {
    return await this.athenaClient.send(new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionID }));
  };

}
