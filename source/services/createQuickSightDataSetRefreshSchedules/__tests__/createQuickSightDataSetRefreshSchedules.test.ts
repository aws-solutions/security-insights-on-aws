// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import 'jest';
import { handler } from '../index';
import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import axios from 'axios';
import 'aws-sdk-client-mock-jest';
import { 
  CreateRefreshScheduleCommand, 
  DeleteRefreshScheduleCommand, 
  QuickSightClient, 
  UpdateRefreshScheduleCommand } from '@aws-sdk/client-quicksight';
import { 
  createDailyRefreshScheduleCommandInput, 
  createEventWithDailySchedule, 
  createEventWithMonthlySchedule, 
  createEventWithWeeklySchedule, 
  createMonthlyRefreshScheduleCommandInput, 
  createWeeklyRefreshScheduleCommandInput, 
  deleteEventWithDailySchedule, 
  deleteRefreshScheduleCommandInput, 
  reponseBodyFailure, 
  responseBodySuccess, 
  responseConfig, 
  responseConfigFailure, 
  responseUrl, 
  solutionUpgradeEvent1, 
  solutionUpgradeEvent2, 
  testContext, 
  updateEventFromWeeklyToDailySchedule } from './testData';
jest.mock('axios');


describe('it should create schedules during for CloudFormation create event', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockQuickSightClient: any;

    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockQuickSightClient = mockClient(QuickSightClient);
        mockQuickSightClient.on(CreateRefreshScheduleCommand).resolves({});
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
      
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('it should create daily schedules', async function () {

      await handler(createEventWithDailySchedule as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateRefreshScheduleCommand, 30);
      expect(mockQuickSightClient).toHaveReceivedCommandWith(CreateRefreshScheduleCommand, createDailyRefreshScheduleCommandInput);
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
    });

    it('it should create weekly schedules', async function () {

      await handler(createEventWithWeeklySchedule as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateRefreshScheduleCommand, 30);
      expect(mockQuickSightClient).toHaveReceivedCommandWith(CreateRefreshScheduleCommand, createWeeklyRefreshScheduleCommandInput);
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
   });

   it('it should create monthly schedules', async function () {
      await handler(createEventWithMonthlySchedule as CloudFormationCustomResourceEvent, testContext as Context);
    
      expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateRefreshScheduleCommand, 30);
      expect(mockQuickSightClient).toHaveReceivedCommandWith(CreateRefreshScheduleCommand, createMonthlyRefreshScheduleCommandInput);
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);

  });


});

describe('it should update schedules during for CloudFormation update event', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockQuickSightClient: any;

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      mockQuickSightClient = mockClient(QuickSightClient);
      mockQuickSightClient.on(CreateRefreshScheduleCommand).resolves({});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it should update daily schedules to weekly', async function () {

    await handler(updateEventFromWeeklyToDailySchedule as CloudFormationCustomResourceEvent, testContext as Context);
    
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(UpdateRefreshScheduleCommand, 30);
    expect(mockQuickSightClient).toHaveReceivedCommandWith(UpdateRefreshScheduleCommand, createDailyRefreshScheduleCommandInput);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
  });

  

 


});

describe('it should delete schedules during for CloudFormation delete event', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockQuickSightClient: any;

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      mockQuickSightClient = mockClient(QuickSightClient);
      mockQuickSightClient.on(CreateRefreshScheduleCommand).resolves({});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it should delete all the dataset schedules', async function () {

    await handler(deleteEventWithDailySchedule as CloudFormationCustomResourceEvent, testContext as Context);
    
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(DeleteRefreshScheduleCommand, 30);
    expect(mockQuickSightClient).toHaveReceivedCommandWith(DeleteRefreshScheduleCommand, deleteRefreshScheduleCommandInput);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
  });

  

 


});

describe('it should send failure response to CloudFormation', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockQuickSightClient: any;

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      mockQuickSightClient = mockClient(QuickSightClient);
      mockQuickSightClient.on(CreateRefreshScheduleCommand).rejects("CreateScheduleError");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it should send failure response to CloudFormation', async function () {

    await handler(createEventWithDailySchedule as CloudFormationCustomResourceEvent, testContext as Context);
    
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateRefreshScheduleCommand, 1);
    expect(mockQuickSightClient).toHaveReceivedCommandWith(CreateRefreshScheduleCommand, createDailyRefreshScheduleCommandInput);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, reponseBodyFailure, responseConfigFailure);
  });

});

describe('it should create schedules during for CloudFormation update event if the solution is upgraded', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockQuickSightClient: any;

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      mockQuickSightClient = mockClient(QuickSightClient);
      mockQuickSightClient.on(CreateRefreshScheduleCommand).resolves({});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it should update daily schedules to weekly', async function () {

    await handler(solutionUpgradeEvent1 as CloudFormationCustomResourceEvent, testContext as Context);
    
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateRefreshScheduleCommand, 30);
    expect(mockQuickSightClient).toHaveReceivedCommandWith(CreateRefreshScheduleCommand, createDailyRefreshScheduleCommandInput);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
  });

});

describe('it should create schedules during for CloudFormation update event if the solution is upgraded', () => {
  let mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockQuickSightClient: any;

  beforeEach(() => {   
      jest.resetAllMocks();     
      mockedAxios.put.mockResolvedValue({});
      mockQuickSightClient = mockClient(QuickSightClient);
      mockQuickSightClient.on(CreateRefreshScheduleCommand).resolves({});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    
  });

  afterAll(() => {
      jest.resetAllMocks();
  });

  it('it should update daily schedules to weekly', async function () {

    await handler(solutionUpgradeEvent2 as CloudFormationCustomResourceEvent, testContext as Context);
    
    expect(mockQuickSightClient).toHaveReceivedCommandTimes(CreateRefreshScheduleCommand, 30);
    expect(mockQuickSightClient).toHaveReceivedCommandWith(CreateRefreshScheduleCommand, createDailyRefreshScheduleCommandInput);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
  });

});