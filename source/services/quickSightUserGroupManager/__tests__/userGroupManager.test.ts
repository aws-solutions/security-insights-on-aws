// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import 'jest';
import { handler } from '../index';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import axios from 'axios';
import 'aws-sdk-client-mock-jest';
import { 
  CreateGroupCommand,
  DeleteGroupCommand,
  QuickSightClient,
  UpdateAnalysisPermissionsCommand,
  UpdateDashboardPermissionsCommand,
  } from '@aws-sdk/client-quicksight';
import { 
  UpdateAnalysisPermissionsCommandInput,
  UpdateDashboardPermissionsCommandInput,
  adminUserGroupInput,
  adminUserGroupInputForDeletion,
  createEventCloudFormation,
  deleteEventCloudFormation,
  readUserGroupInput,
  readUserGroupInputForDeletion,
  responseBodyForFailure,
  responseBodySuccess, 
  responseBodySuccessForDeletion, 
  responseConfig, 
  responseConfigForDeletion, 
  responseConfigForFailure, 
  responseUrl, 

  } from './testData';
jest.mock('axios');


describe('it should create QuickSight user groups during for CloudFormation create event', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockQuickSightClient: any;

    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockQuickSightClient = mockClient(QuickSightClient);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
      
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('it should create QuickSight user groups', async function () {

      await handler(createEventCloudFormation as CloudFormationCustomResourceEvent);
      
      expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateGroupCommand, 2);
      expect(mockQuickSightClient).toHaveReceivedCommandWith(CreateGroupCommand, adminUserGroupInput);
      expect(mockQuickSightClient).toHaveReceivedCommandWith(CreateGroupCommand, readUserGroupInput);
      expect(mockQuickSightClient).toHaveReceivedCommandWith(UpdateDashboardPermissionsCommand, UpdateDashboardPermissionsCommandInput);
      expect(mockQuickSightClient).toHaveReceivedCommandWith(UpdateAnalysisPermissionsCommand, UpdateAnalysisPermissionsCommandInput);
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
    });

});

describe('it should delete QuickSight user groups during for CloudFormation delete event', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockQuickSightClient: any;

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      mockQuickSightClient = mockClient(QuickSightClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it should delete QuickSight user groups', async function () {

    await handler(deleteEventCloudFormation as CloudFormationCustomResourceEvent);
    
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(DeleteGroupCommand, 2);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccessForDeletion, responseConfigForDeletion);
    expect(mockQuickSightClient).toHaveReceivedCommandWith(DeleteGroupCommand, readUserGroupInputForDeletion);
    expect(mockQuickSightClient).toHaveReceivedCommandWith(DeleteGroupCommand, adminUserGroupInputForDeletion);

  });

});

describe('it should return error if QuickSight user group creation fails', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockQuickSightClient: any;

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      mockQuickSightClient = mockClient(QuickSightClient);
      mockQuickSightClient.on(CreateGroupCommand).rejects('UserGroupCreationError')

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it should delete QuickSight user groups', async function () {

    await handler(createEventCloudFormation as CloudFormationCustomResourceEvent);
    
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodyForFailure, responseConfigForFailure);

  });

});