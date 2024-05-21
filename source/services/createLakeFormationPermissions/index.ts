// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Context, CloudFormationCustomResourceEvent, EventBridgeEvent } from 'aws-lambda';
import { logger } from './utils/logger';
import { AxiosResponse } from 'axios';
import { EventDetail } from './lib/helpers/interfaces';
import { GlueOperations } from './lib/serviceOperations/glueOperations';
import { LakeFormationOperations } from './lib/serviceOperations/lakeFormationOperations';
import { REGION, USER_AGENT_STRING } from './lib/helpers/constants';
import { ServiceClientProvider } from './lib/helpers/serviceClientProvider';
import { GlueResourcesManager } from './lib/resourceManagers/glueResourceManager';
import { LakeFormationsPermissionsManager } from './lib/resourceManagers/lakeFormationPermissionsManager';
import { EventBridgeEventHandler } from './lib/handler/eventBridgeEventHandler';
import { CloudFormationEventHandler } from './lib/handler/cloudFormationEventHandler';


export async function handler(
  event: CloudFormationCustomResourceEvent | EventBridgeEvent<string, EventDetail>,
  context: Context,
): Promise<AxiosResponse | void> {
  logger.info({
    label: 'CreateLakeFormationPermissions/Handler',
    message: {
      data: 'CreateLakeFormationPermissions handler invoked',
      event: event,
      context: context,
    },
  });
  
  let { lakeFormationsPermissionsManager, glueResourcesManager } = getResourceManagerObjects();

  try {
    if ((event as CloudFormationCustomResourceEvent).RequestType) {
      return await new CloudFormationEventHandler(
        event as CloudFormationCustomResourceEvent,
        context,
        lakeFormationsPermissionsManager, 
        glueResourcesManager
      ).handleEvent();
    } else {
      return await new EventBridgeEventHandler(
        lakeFormationsPermissionsManager, 
      ).handleEvent();
    }
  } catch (error) {
    logger.error({
      label: 'CreateLakeFormationPermissions/Handler',
      message: {
        data: 'Error occurred when executing CreateLakeFormationPermissions handler',
        event: event,
        context: context,
        result: 'Error',
        error: error,
      },
    });
    throw error
  }
}

const getResourceManagerObjects = () => {
  logger.debug({
    label: 'CreateLakeFormationPermissions/Handler',
    message: {
      data: 'getResourceManagerObjects method invoked',
    },
  });
  let serviceClientProvider = new ServiceClientProvider(REGION, USER_AGENT_STRING);
  let glueOperations: GlueOperations = new GlueOperations(serviceClientProvider.getGlueClient());
  let glueResourcesManager: GlueResourcesManager = new GlueResourcesManager(glueOperations);
  let lakeFormationOperations: LakeFormationOperations = new LakeFormationOperations(
    serviceClientProvider.getLakeFormationClient(),
  );
  let lakeFormationsPermissionsManager: LakeFormationsPermissionsManager = new LakeFormationsPermissionsManager(
    lakeFormationOperations,
  );
  return { lakeFormationsPermissionsManager, glueResourcesManager };
};
