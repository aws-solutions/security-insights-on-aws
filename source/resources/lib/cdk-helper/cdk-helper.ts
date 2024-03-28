// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CfnResource, CfnCondition } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';


export interface CfnNagSuppression {
  readonly id: string;
  readonly reason: string;
}

export function addCfnNagSuppression(resource: IConstruct | CfnResource, suppression: CfnNagSuppression): void {
  let cfnResource = resource as CfnResource;
  if (!cfnResource.cfnOptions) {
    cfnResource = resource.node.defaultChild as CfnResource;
  }
  if (!cfnResource?.cfnOptions) {
    throw new Error(`Resource ${cfnResource?.logicalId} has no cfnOptions, unable to add cfn-nag suppression`);
  }
  const existingSuppressions: CfnNagSuppression[] = cfnResource.cfnOptions.metadata?.cfn_nag?.rules_to_suppress;
  if (existingSuppressions) {
    existingSuppressions.push(suppression);
  } else {
    cfnResource.cfnOptions.metadata = {
      cfn_nag: {
        rules_to_suppress: [suppression],
      },
    };
  }
}

export function overrideLogicalId(resource: IConstruct | CfnResource, logicalId: string) {
    let cfnResource = resource as CfnResource;
    if (!cfnResource.cfnOptions) {
      cfnResource = resource.node.defaultChild as CfnResource;
    }
    if (!cfnResource) {
      throw new Error('Unable to override logical ID, not a CfnResource');
    }
    cfnResource.overrideLogicalId(logicalId);
}

export function setCondition(resource: IConstruct | CfnResource, condition: CfnCondition): void {
    let cfnResource = resource as CfnResource;
    if (!cfnResource.cfnOptions) {
      cfnResource = resource.node.defaultChild as CfnResource;
    }
    const oldCondition = cfnResource?.cfnOptions?.condition;
    if (oldCondition) {
      throw new Error(`Resource ${cfnResource?.logicalId} already has a condition: ${oldCondition.logicalId}`);
    }
    if (!cfnResource?.cfnOptions) {
      throw new Error(`Resource ${cfnResource?.logicalId} is not a CfnResource, unable to add condition`);
    }
    cfnResource.cfnOptions.condition = condition;
}