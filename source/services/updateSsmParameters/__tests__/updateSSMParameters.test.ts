// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import 'jest';
import { handler } from '../index';
import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import axios from 'axios';
import 'aws-sdk-client-mock-jest';
import { 
  createEventCloudFormation,
  getParameterCommandResponseAppFabric,
  getParameterCommandResponseCloudTrail,
  getParameterCommandResponseSecurityHub,
  getParameterCommandResponseVpcFlowLogs,
  PutParameterInputForAppFabric,
  PutParameterInputForCloudtrail,
  PutParameterInputForSecurityHub,
  PutParameterInputForVpcFlowLogs,
  responseBodySuccess, 
  responseConfig, 
  responseUrl, 
  testContext,
  updateEventCloudFormationNewVersion,
  updateEventCloudFormationSameVersion,
  } from './testData';
import { GetParameterCommand, PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
jest.mock('axios');
jest.setTimeout(70000)



/**
 * 1. Create event should not call any API
 * 2. Update event should not call any API for the same version
 * 3. Update event should call update SSM parameter for different version
 */

describe('it should not update SSM parameters CloudFormation create event', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockSSMClient: any;

    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockSSMClient= mockClient(SSMClient);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('it should not update SSM parameters', async function () {

        await handler(createEventCloudFormation as CloudFormationCustomResourceEvent, testContext as Context);
  
        expect(mockSSMClient).toHaveReceivedCommandTimes(GetParameterCommand, 0);
        expect(mockSSMClient).toHaveReceivedCommandTimes(PutParameterCommand, 0)
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
      });
});

describe('it should not update SSM parameters CloudFormation Update event for same version', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockSSMClient: any;


    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockSSMClient= mockClient(SSMClient);

    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('it should not update SSM parameters', async function () {

        await handler(updateEventCloudFormationSameVersion as CloudFormationCustomResourceEvent, testContext as Context);
        expect(mockSSMClient).toHaveReceivedCommandTimes(GetParameterCommand, 0);
        expect(mockSSMClient).toHaveReceivedCommandTimes(PutParameterCommand, 0)
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
      });
});

describe('it should update SSM parameters CloudFormation Update event for different version', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockSSMClient: any;

    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockSSMClient= mockClient(SSMClient);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('it should update SSM parameters', async function () {

      mockSSMClient.on(GetParameterCommand, { Name: '/solutions/securityInsights/us-east-1/appfabric' }).resolves(getParameterCommandResponseAppFabric);
      mockSSMClient.on(GetParameterCommand, { Name: '/solutions/securityInsights/us-east-1/cloudtrail' }).resolves(getParameterCommandResponseCloudTrail);
      mockSSMClient.on(GetParameterCommand, { Name: '/solutions/securityInsights/us-east-1/securityHub' }).resolves(getParameterCommandResponseSecurityHub);
      mockSSMClient.on(GetParameterCommand, { Name: '/solutions/securityInsights/us-east-1/vpcFlowLogs' }).resolves(getParameterCommandResponseVpcFlowLogs);

      await handler(updateEventCloudFormationNewVersion as CloudFormationCustomResourceEvent, testContext as Context);
      expect(mockSSMClient).toHaveReceivedCommandTimes(GetParameterCommand, 4);
      expect(mockSSMClient).toHaveReceivedCommandTimes(PutParameterCommand, 4)

      expect(mockSSMClient).toHaveReceivedCommandWith(PutParameterCommand, PutParameterInputForAppFabric);
      expect(mockSSMClient).toHaveReceivedCommandWith(PutParameterCommand, PutParameterInputForCloudtrail);
      expect(mockSSMClient).toHaveReceivedCommandWith(PutParameterCommand, PutParameterInputForSecurityHub);
      expect(mockSSMClient).toHaveReceivedCommandWith(PutParameterCommand, PutParameterInputForVpcFlowLogs);


      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
    });
});