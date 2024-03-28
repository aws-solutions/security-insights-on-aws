// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import { CompletionStatus } from '../helpers/interfaces';
import { sendCustomResourceResponseToCloudFormation } from '../../utils/cfnResponse/cfnCustomResource';
import { StatusTypes } from '../helpers/enum';
import { logger } from '../../utils/logger';
import { CreateEventHandler } from './createEventHandler';
import { LakeFormationsPermissionsManager } from '../resourceManagers/lakeFormationPermissionsManager';
import { GlueResourcesManager } from '../resourceManagers/glueResourceManager';
import { DeleteEventHandler } from './deleteEventHandler';
import { UpdateEventHandler } from './updateEventHandler';

export class CloudFormationEventHandler {
  constructor(
    private event: CloudFormationCustomResourceEvent,
    private context: Context,
    private lakeFormationsPermissionsManager: LakeFormationsPermissionsManager, 
    private glueResourcesManager: GlueResourcesManager
  ) {
    this.event = event;
    this.lakeFormationsPermissionsManager = lakeFormationsPermissionsManager;
    this.glueResourcesManager = glueResourcesManager;
  }

  public handleEvent = async () => {
    logger.debug({
      label: 'CreateQuickSightDataSets/Handler',
      message: {
        data: 'CloudFormationEventHandler invoked',
      },
    });
    const response: CompletionStatus = {
      Status: StatusTypes.SUCCESS,
      Data: {},
    };

    try {
      if (this.event.RequestType == 'Create') {
        logger.debug({
          label: 'CreateLakeFormationPermissions/handler',
          message: 'Request type is Create',
        });
        await new CreateEventHandler(this.lakeFormationsPermissionsManager, this.glueResourcesManager).handleEvent();
      }

      if (this.event.RequestType == 'Update') {
        logger.debug({
          label: 'CreateLakeFormationPermissions/handler',
          message: 'Request type is Update',
        });
        await new UpdateEventHandler(this.lakeFormationsPermissionsManager).handleEvent();
      }

      if (this.event.RequestType == 'Delete') {
        logger.debug({
          label: 'CreateLakeFormationPermissions/handler',
          message: 'Request type is Delete',
        });
        await new DeleteEventHandler(this.lakeFormationsPermissionsManager).handleEvent();
      }
    } catch (error) {
      response.Status = StatusTypes.FAILED;
      response.Data.Error = {
        Code: error.code ?? 'CustomResourceError',
        Message: error.message ?? 'Custom resource error occurred when creating QuickSight Datasets.',
      };
    } finally {
      await sendCustomResourceResponseToCloudFormation(this.event, this.context, response);
    }
  };
}
