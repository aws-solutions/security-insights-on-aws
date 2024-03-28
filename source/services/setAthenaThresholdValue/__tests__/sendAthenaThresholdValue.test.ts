// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import 'jest';
import {handler } from '../index';
import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import axios from 'axios';
import 'aws-sdk-client-mock-jest';
import { 
  createEventCloudFormationThresholdUnitInEB,
  createEventCloudFormationThresholdUnitInGB,
  createEventCloudFormationThresholdUnitInMB,
  createEventCloudFormationThresholdUnitInPB,
  createEventCloudFormationThresholdUnitInTB,
  responseBodySuccessForUnitInEB,
  responseBodySuccessForUnitInGB, 
  responseBodySuccessForUnitInMB, 
  responseBodySuccessForUnitInPB, 
  responseBodySuccessForUnitInTB, 
  responseConfigForUnitInEB, 
  responseConfigForUnitInGB, 
  responseConfigForUnitInMB, 
  responseConfigForUnitInPB, 
  responseConfigForUnitInTB, 
  responseUrl,
  testContext,
  updateEventCloudFormationThresholdUnitInGB
  } from './testData'; 
jest.mock('axios');


describe('it should return threshold Value ', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    beforeEach(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
      
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('it should return threshold value for GB unit during creation', async function () {

      await handler(createEventCloudFormationThresholdUnitInGB as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccessForUnitInGB, responseConfigForUnitInGB);
    });

    it('it should return threshold value for MB unit during creation', async function () {

      await handler(createEventCloudFormationThresholdUnitInMB as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccessForUnitInMB, responseConfigForUnitInMB);
    });

    it('it should return threshold value for TB unit during creation', async function () {

      await handler(createEventCloudFormationThresholdUnitInTB as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccessForUnitInTB, responseConfigForUnitInTB);
    });

    it('it should return threshold value for PB unit during creation', async function () {

      await handler(createEventCloudFormationThresholdUnitInPB as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccessForUnitInPB, responseConfigForUnitInPB);
    });

    it('it should return threshold value for EB unit during creation', async function () {

      await handler(createEventCloudFormationThresholdUnitInEB as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccessForUnitInEB, responseConfigForUnitInEB);
    });

    it('it should return threshold value for GB unit during update event', async function () {

      await handler(updateEventCloudFormationThresholdUnitInGB as CloudFormationCustomResourceEvent, testContext as Context);
      
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccessForUnitInGB, responseConfigForUnitInGB);
    });
});