// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import 'jest';
import { handler } from '../index';
import { Context, CloudFormationCustomResourceEvent, EventBridgeEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import axios from 'axios';
import 'aws-sdk-client-mock-jest';
import { 
  CreateDataSetCommand,
  CreateDataSourceCommand,
  DeleteDataSetCommand,
  QuickSightClient,
  UpdateDataSetCommand, 
  } from '@aws-sdk/client-quicksight';
import { 
  createEventCloudFormation,
  datasourceCreatioConfigFailure,
  datasourceCreationFailureResponseBody,
  deleteEventCloudFormation,
  getParameterCommandResponseForAppFabric,
  getParameterCommandResponseForCloudtrail,
  getParameterCommandResponseForSecurityHub,
  getParameterCommandResponseForVpcFlowLogs,
  reponseBodyFailure,
  responseBodySuccess, 
  responseConfig, 
  responseConfigFailure, 
  responseUrl, 
  ssmParameterEventForAppFabric, 
  ssmParameterEventForCloudtrail, 
  ssmParameterEventForSecurityHub, 
  ssmParameterEventForVpcFlowLogs, 
  testContext,
  updateEventCloudFormation
  } from './testData';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { EventDetail } from '../lib/helpers/interfaces';
jest.mock('axios');
jest.setTimeout(70000)


describe('it should create QuickSight datasets during for CloudFormation create event', () => {
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

    it('it should create QuickSight datasets', async function () {

      await handler(createEventCloudFormation as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateDataSetCommand, 30);
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
    });

}, );

describe('it should delete QuickSight datasets during for CloudFormation delete event', () => {
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

  it('it should delete QuickSight datasets', async function () {

    await handler(deleteEventCloudFormation as CloudFormationCustomResourceEvent, testContext as Context);
    
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(DeleteDataSetCommand, 30);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
  });

});

describe('it should update QuickSight datasets during for ssm parameter event', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockQuickSightClient: any;
  let mockSsmClient: any

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      mockQuickSightClient = mockClient(QuickSightClient);
      mockSsmClient = mockClient(SSMClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it should update security hub QuickSight datasets', async function () {
    mockSsmClient.on(GetParameterCommand).resolves(getParameterCommandResponseForSecurityHub);
    await handler(ssmParameterEventForSecurityHub as  EventBridgeEvent<string, EventDetail>, testContext as Context);  
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(UpdateDataSetCommand, 5);
  });

  it('it should update cloudtrail QuickSight datasets', async function () {
    mockSsmClient.on(GetParameterCommand).resolves(getParameterCommandResponseForCloudtrail);
    await handler(ssmParameterEventForCloudtrail as  EventBridgeEvent<string, EventDetail>, testContext as Context);  
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(UpdateDataSetCommand, 16);
  });

  it('it should update vpcflowgs QuickSight datasets', async function () {
    mockSsmClient.on(GetParameterCommand).resolves(getParameterCommandResponseForVpcFlowLogs);
    await handler(ssmParameterEventForVpcFlowLogs as  EventBridgeEvent<string, EventDetail>, testContext as Context);  
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(UpdateDataSetCommand, 5);
  });

  it('it should update appFabric QuickSight datasets', async function () {
    mockSsmClient.on(GetParameterCommand).resolves(getParameterCommandResponseForAppFabric);
    await handler(ssmParameterEventForAppFabric as  EventBridgeEvent<string, EventDetail>, testContext as Context);  
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(UpdateDataSetCommand, 4);
  });

});

describe('it should send error notification to CloudFormation during create event', () => {
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

  it('it should send error message to Cloudformation when datasource creation fails', async function () {
    mockQuickSightClient.on(CreateDataSourceCommand).rejects("DataSetError");

    await handler(createEventCloudFormation as CloudFormationCustomResourceEvent, testContext as Context);
  
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, datasourceCreationFailureResponseBody, datasourceCreatioConfigFailure);
  });

  it('it should send error message to Cloudformation when dataset creation fails', async function () {
    mockQuickSightClient.on(CreateDataSetCommand).rejects("DataSetError");

    await handler(createEventCloudFormation as CloudFormationCustomResourceEvent, testContext as Context);
  
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, reponseBodyFailure, responseConfigFailure);
  });

  it('it should not send error message to Cloudformation when dataset deletion fails for update scenario', async function () {
    mockQuickSightClient.on(DeleteDataSetCommand).rejects("DataSetError");

    await handler(deleteEventCloudFormation as CloudFormationCustomResourceEvent, testContext as Context);
  
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
  });

});

describe('it should update QuickSight datasets during for CloudFormation update event', () => {
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

  it('it should create QuickSight datasets', async function () {

    await handler(updateEventCloudFormation as CloudFormationCustomResourceEvent, testContext as Context);
    
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(DeleteDataSetCommand, 30);
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateDataSetCommand, 30);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
  });

});