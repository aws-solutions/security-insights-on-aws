// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
process.env.SEND_METRIC = 'False';
import 'jest';
import { handler } from '../index';
import { mockClient } from 'aws-sdk-client-mock';
import axios from 'axios';
import 'aws-sdk-client-mock-jest';
import { AthenaClient, GetQueryExecutionCommand } from '@aws-sdk/client-athena';
import { getQueryExecutionResponse, athenaExecutionEvent } from './testData';
jest.mock('axios');


describe('it does not send athena execution metrics', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockAthenaClient: any;

    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockAthenaClient = mockClient(AthenaClient);
        mockAthenaClient.on(GetQueryExecutionCommand).resolves(getQueryExecutionResponse);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
      
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('it does not send athena metrics', async function () {

      await handler( athenaExecutionEvent);
      
      expect(mockAthenaClient).toHaveReceivedCommandTimes(GetQueryExecutionCommand, 0);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
});