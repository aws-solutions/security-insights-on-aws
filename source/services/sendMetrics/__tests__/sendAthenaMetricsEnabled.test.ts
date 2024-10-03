// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

process.env.SEND_METRIC = 'True';
import 'jest';
import { handler } from '../index';
import { mockClient } from 'aws-sdk-client-mock';
import axios from 'axios';
import MockDate from 'mockdate';
import 'aws-sdk-client-mock-jest';
import { AthenaClient, GetQueryExecutionCommand } from '@aws-sdk/client-athena';
import { 
    getQueryExecutionResponse, 
    getQueryExecutionCommandInput, 
    responseBodySuccess, 
    responseConfig, 
    responseUrl, 
    athenaExecutionEvent 
} from './testData';
jest.mock('axios');


describe('it sends athena execution metrics', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockAthenaClient: any;

    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockAthenaClient = mockClient(AthenaClient);
        mockAthenaClient.on(GetQueryExecutionCommand).resolves(getQueryExecutionResponse);
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

      await handler( athenaExecutionEvent);
      
      expect(mockAthenaClient).toHaveReceivedCommandTimes(GetQueryExecutionCommand, 1);
      expect(mockAthenaClient).toHaveReceivedCommandWith(GetQueryExecutionCommand, getQueryExecutionCommandInput);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(responseUrl, JSON.stringify(responseBodySuccess), responseConfig);
    });
});