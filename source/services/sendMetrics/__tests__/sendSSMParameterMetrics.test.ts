// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

process.env.SEND_METRIC = 'True';
import 'jest';
import { handler } from '../index';
import { mockClient } from 'aws-sdk-client-mock';
import axios from 'axios';
import MockDate from 'mockdate';
import 'aws-sdk-client-mock-jest';
import { 
    responseConfig, 
    responseUrl, 
    getParameterCommandResponseForSecurityHub,
    ssmParameterEventForSecurityHub,
    responseBodySSMParameterEvent
} from './testData';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
jest.mock('axios');


describe('it sends SSM Parameter metrics', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockSSMClient: any;

    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockSSMClient = mockClient(SSMClient);
        mockSSMClient.on(GetParameterCommand).resolves(getParameterCommandResponseForSecurityHub);
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

    it('it sends SSM Parameter metrics', async function () {

      await handler( ssmParameterEventForSecurityHub);
      
      expect(mockSSMClient).toHaveReceivedCommandTimes(GetParameterCommand, 1);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(responseUrl, JSON.stringify(responseBodySSMParameterEvent), responseConfig);
    });
});