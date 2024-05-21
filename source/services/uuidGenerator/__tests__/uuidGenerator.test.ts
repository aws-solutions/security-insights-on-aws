// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import 'jest';
import { handler } from '../index';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import axios from 'axios';
import { createEventForCloudFormation, responseBodySuccess, responseConfig, responseUrl } from './testData';
jest.mock('axios');
jest.mock('uuid', () => ({ v4: () => '123456' }));

describe('it should return uuid when CloudFormation template is deployed', () => {

    let mockedAxios = axios as jest.Mocked<typeof axios>;
    beforeAll(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('it should return uuid', async function () {
        await handler(createEventForCloudFormation as CloudFormationCustomResourceEvent);
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
    });

});
