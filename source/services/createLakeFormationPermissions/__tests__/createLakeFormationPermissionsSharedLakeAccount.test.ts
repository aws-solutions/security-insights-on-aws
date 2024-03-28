// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

process.env.SECURITY_LAKE_ACCOUNT_ID = "222222222222"
import 'jest';
import { handler } from '../index';
import { Context, CloudFormationCustomResourceEvent } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { GetDataLakeSettingsCommand, GrantPermissionsCommand, LakeFormationClient, ListPermissionsCommand, PutDataLakeSettingsCommand, RevokePermissionsCommand } from '@aws-sdk/client-lakeformation'
import axios from 'axios';
import 'aws-sdk-client-mock-jest';
import { createEventForSolutionDeployedInSecurityLakeAccount, deleteEventForSolutionDeployedInSecurityLakeAccount, getDataLakeSettingsResponseForCreateEvent, getDataLakeSettingsResponseForDeleteEvent, grantPermissionsCommandInputSharedAccount, listPermissionsCommandResponse, reponseBodyFailure, responseBodyFailureForDeletion, responseBodySuccess, responseConfig, responseConfigFailure, responseConfigFailureForDeletion, responseUrl, ssmParameterUpdateEvent, updateEventForSolutionDeployedInSecurityLakeAccount, updatedDataLakeSettings, updatedDataLakeSettingsForDeletion } from './testData';
import { CreateTableCommand, GlueClient } from '@aws-sdk/client-glue';
jest.mock('axios');


describe('it should create permissions when deployment account is same as security lake account', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockLakeFormationClient: any;
    let mockGlueClient: any

    beforeAll(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockGlueClient = mockClient(GlueClient)
        mockLakeFormationClient = mockClient(LakeFormationClient);
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient.on(GetDataLakeSettingsCommand).resolves(getDataLakeSettingsResponseForCreateEvent);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('successfully creates LakeFormation permissions on CloudFormation deployment', async function () {
        await handler(createEventForSolutionDeployedInSecurityLakeAccount as CloudFormationCustomResourceEvent, {} as Context);
        expect(mockGlueClient).toHaveReceivedCommandTimes(CreateTableCommand, 4);
        expect(mockLakeFormationClient).toHaveReceivedCommandTimes(PutDataLakeSettingsCommand, 1);
        expect(mockLakeFormationClient).toHaveReceivedCommandWith(PutDataLakeSettingsCommand, updatedDataLakeSettings);
        expect(mockLakeFormationClient).toHaveReceivedCommandTimes(GrantPermissionsCommand, 36);
        expect(mockLakeFormationClient).toHaveReceivedCommandWith(GrantPermissionsCommand, grantPermissionsCommandInputSharedAccount);
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);
    });
});

describe('it should delete permissions when deployment account is same as security lake account', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockLakeFormationClient: any;

    beforeAll(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient = mockClient(LakeFormationClient);
        mockLakeFormationClient.on(GetDataLakeSettingsCommand).resolves(getDataLakeSettingsResponseForDeleteEvent);
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient.on(ListPermissionsCommand).resolves(listPermissionsCommandResponse);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('successfully deletes LakeFormation permissions on CloudFormation stack deletion', async function () {

        await handler(deleteEventForSolutionDeployedInSecurityLakeAccount as CloudFormationCustomResourceEvent, {} as Context);
        
        expect(mockLakeFormationClient).toHaveReceivedCommandTimes(RevokePermissionsCommand, 1);
        expect(mockLakeFormationClient).toHaveReceivedCommandTimes(GrantPermissionsCommand, 0);
        expect(mockLakeFormationClient).toHaveReceivedCommandWith(PutDataLakeSettingsCommand, updatedDataLakeSettingsForDeletion);
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);

    });

});

describe('it should send failure response to cloudformation if grant permissions fails', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockLakeFormationClient: any;

    beforeAll(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient = mockClient(LakeFormationClient);
        mockLakeFormationClient.on(GetDataLakeSettingsCommand).resolves(getDataLakeSettingsResponseForCreateEvent);
        mockLakeFormationClient.on(ListPermissionsCommand).resolves(listPermissionsCommandResponse);
        mockLakeFormationClient.on(GrantPermissionsCommand).rejects('GrantPermissionsError')
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should send failure response to cloudformation', async function () {

        await handler(createEventForSolutionDeployedInSecurityLakeAccount as CloudFormationCustomResourceEvent, {} as Context);
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(responseUrl, reponseBodyFailure, responseConfigFailure);

    });

});

describe('it should send failure response to cloudformation when list permissions fails', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockLakeFormationClient: any;

    beforeAll(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient = mockClient(LakeFormationClient);
        mockLakeFormationClient.on(GetDataLakeSettingsCommand).resolves(getDataLakeSettingsResponseForDeleteEvent);
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient.on(ListPermissionsCommand).rejects('Error');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it(' sends failure response on CloudFormation stack deletion', async function () {

        await handler(deleteEventForSolutionDeployedInSecurityLakeAccount as CloudFormationCustomResourceEvent, {} as Context);
        
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodyFailureForDeletion, responseConfigFailureForDeletion);

    });

});

describe('it should update permissions for SSM parameter event', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockLakeFormationClient: any;

    beforeAll(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient = mockClient(LakeFormationClient);
        //mockedAxios.put.mockResolvedValue({});
        //mockLakeFormationClient.on(GetDataLakeSettingsCommand).resolves(getDataLakeSettingsResponseForCreateEvent);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('successfully creates LakeFormation permissions on CloudFormation deployment', async function () {

        await handler(ssmParameterUpdateEvent, {} as Context);
        expect(mockLakeFormationClient).toHaveReceivedCommandTimes(GrantPermissionsCommand, 32);
       
    });

});

describe('it should Update permissions when deployment is in shared lake account', () => {
    let mockedAxios = axios as jest.Mocked<typeof axios>;
    let mockLakeFormationClient: any;

    beforeAll(() => {   
        jest.resetAllMocks();     
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient = mockClient(LakeFormationClient);
        mockedAxios.put.mockResolvedValue({});
        mockLakeFormationClient.on(GetDataLakeSettingsCommand).resolves(getDataLakeSettingsResponseForCreateEvent);
        mockLakeFormationClient.on(ListPermissionsCommand).resolves(listPermissionsCommandResponse);

    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('successfully updates LakeFormation permissions on CloudFormation deployment', async function () {

        await handler(updateEventForSolutionDeployedInSecurityLakeAccount as CloudFormationCustomResourceEvent, {} as Context);
        
        expect(mockLakeFormationClient).toHaveReceivedCommandTimes(GrantPermissionsCommand, 36);
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(responseUrl, responseBodySuccess, responseConfig);

    });

});