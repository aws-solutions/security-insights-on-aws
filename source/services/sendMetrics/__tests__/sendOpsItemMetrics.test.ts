// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

process.env.SEND_METRIC = 'True';
import { opsItemResponseConfig, opsItemStatusChangeEvent, responseBodyOpsItem, responseUrl } from './testData';
import 'jest';
import { handler } from '../index';
import axios from 'axios';
import MockDate from 'mockdate';
import 'aws-sdk-client-mock-jest';

jest.mock('axios');



describe('it sends OpsItem metrics', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      MockDate.set('2020-09-01');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    MockDate.reset();

  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it sends athena metrics', async function () {

    await handler(opsItemStatusChangeEvent);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(responseUrl, JSON.stringify(responseBodyOpsItem), opsItemResponseConfig);
    
  });
});