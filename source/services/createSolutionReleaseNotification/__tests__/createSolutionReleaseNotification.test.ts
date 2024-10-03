// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { handler } from '../index';
import {
  CreateOpsItemCommand,
  DescribeOpsItemsCommand,
  OpsItem,
  SSMClient,
  UpdateOpsItemCommand,
} from '@aws-sdk/client-ssm';
import { mockClient } from 'aws-sdk-client-mock';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';

jest.mock('axios');

it('should throw an error when failing to create OpsItem', async function() {
  // GIVEN
  process.env.CURRENT_RELEASE_TAG = 'v1.0.0';

  // GitHub responds with tag v1.2.3
  (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
    data: {
      tag_name: 'v1.2.3',
    },
  });

  // SSM is unhappy
  const ssmMock = mockClient(SSMClient);
  ssmMock.on(CreateOpsItemCommand).rejects(new Error());

  // WHEN
  await expect(
    handler(),
    // THEN
  ).rejects.toThrow(Error);

});

it('should throw an error when OpsItem already exists', async function() {
  // GIVEN
  class OpsItemAlreadyExistsException extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'OpsItemAlreadyExistsException';
    }
  }

  process.env.CURRENT_RELEASE_TAG = 'v1.0.0';

  // GitHub responds with tag v1.2.3
  (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
    data: {
      tag_name: 'v1.2.3',
    },
  });

  const ssmMock = mockClient(SSMClient);
  ssmMock.on(CreateOpsItemCommand).rejects(
    new OpsItemAlreadyExistsException('An OpsItem with the specified ID already exists.'),
  );

  // WHEN
  await handler();

  // THEN expect no error, but also not trying to resolve ops items
  expect(ssmMock.commandCalls(DescribeOpsItemsCommand)).toHaveLength(0);
  expect(ssmMock.commandCalls(CreateOpsItemCommand)).toHaveLength(1);
});

it('should create an OpsItem', async function() {
  // GIVEN
  process.env.CURRENT_RELEASE_TAG = 'v1.0.0';

  // GitHub responds with tag v1.2.3
  (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
    data: {
      tag_name: 'v1.2.3',
    },
  });

  // SSM responds happily
  const ssmMock = mockClient(SSMClient);
  ssmMock.on(CreateOpsItemCommand).resolves({
    OpsItemId: 'mock-ops-item-id',
  });


  // WHEN
  await handler();

  // THEN
  expect(ssmMock.commandCalls(CreateOpsItemCommand)).toHaveLength(1);
});

it('should not resolve OpsItems unrelated to solution', async function() {
  // GIVEN
  process.env.CURRENT_RELEASE_TAG = 'v1.2.3';

  // GitHub responds with same tag
  (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
    data: {
      tag_name: 'v1.2.3',
    },
  });

  const stsMock = mockClient(STSClient);
  stsMock.on(GetCallerIdentityCommand).resolves({
    Arn: 'Solution-Role-Arn',
  });

  // existing ops items are not created by solution
  const ssmMock = mockClient(SSMClient);
  ssmMock.on(DescribeOpsItemsCommand).resolvesOnce({
    OpsItemSummaries: createTestOpsItems(25, 'someone-else'),
    NextToken: 'foo',
  }).resolvesOnce({
    OpsItemSummaries: createTestOpsItems(5, 'someone-else'),
  });

  // WHEN
  await handler();

  // THEN expect no UpdateOpsItemCommands to have been sent
  expect(ssmMock.commandCalls(UpdateOpsItemCommand)).toHaveLength(0);
});

it('should resolve OpsItems created by this solution', async function() {
  // GIVEN
  process.env.CURRENT_RELEASE_TAG = 'v1.2.3';

  // GitHub responds with same tag
  (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
    data: {
      tag_name: 'v1.2.3',
    },
  });

  const stsMock = mockClient(STSClient);
  stsMock.on(GetCallerIdentityCommand).resolves({
    Arn: 'Solution-Role-Arn',
  });

  // existing ops items are not created by solution
  const ssmMock = mockClient(SSMClient);
  ssmMock.on(DescribeOpsItemsCommand).resolvesOnce({
    OpsItemSummaries: createTestOpsItems(5, 'Solution-Role-Arn'),
  });

  // WHEN
  await handler();

  // THEN expect no UpdateOpsItemCommands to have been sent
  expect(ssmMock.commandCalls(UpdateOpsItemCommand)).toHaveLength(5);
});


function createTestOpsItems(count: number, createdBy: string) {
  const opsItems: OpsItem[] = [];
  for (let i = 0; i < count; i++) {
    opsItems.push({
      OpsItemId: '445ffc3f-a3ee-48e2-8db5-f1437cbd81e6' + i,
      CreatedBy: createdBy,
      Status: 'Approved',
    });
  }
  return opsItems;
}
