// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as cdk from 'aws-cdk-lib';
import * as appreg from '@aws-cdk/aws-servicecatalogappregistry-alpha';
import { Aws, Fn, Tags } from 'aws-cdk-lib';
import { CfnApplication } from 'aws-cdk-lib/aws-applicationinsights';
import {
  CfnAttributeGroup,
  CfnAttributeGroupAssociation,
  CfnResourceAssociation,
} from 'aws-cdk-lib/aws-servicecatalogappregistry';
import { Construct } from 'constructs';
import { overrideLogicalId } from '../cdk-helper/cdk-helper';

export interface AppRegistryResourcesProps extends cdk.StackProps {
  solutionId: string;
  solutionName: string;
  solutionVersion: string;
  appRegistryApplicationName: string;
  applicationType: string;
  uniqueSuffix: string;
}

export class AppRegistryResources extends Construct {
  constructor(scope: Construct, id: string, props: AppRegistryResourcesProps) {
    super(scope, id);
    const application = new appreg.Application(this, 'AppRegistry', {
      applicationName: Fn.join('-', [props.appRegistryApplicationName, Aws.REGION, Aws.ACCOUNT_ID]),
      description: `Service Catalog application to track and manage all your resources for the solution ${props.solutionName}`,
    });
    const cfnApplication = application.node.defaultChild as CfnApplication;
    overrideLogicalId(cfnApplication, 'Application');

    const cfnresourceAssociation = new CfnResourceAssociation(this, 'CfnResourceAssociation', {
      application: application.applicationId,
      resource: Aws.STACK_ID,
      resourceType: 'CFN_STACK',
    });
    overrideLogicalId(cfnresourceAssociation, 'AppRegistryApplicationStackAssociation');

    const attributeGroup = new appreg.AttributeGroup(this, 'DefaultApplicationAttributeGroup', {
      attributeGroupName: Fn.join('-', [
        props.appRegistryApplicationName,
        Aws.REGION,
        Aws.ACCOUNT_ID,
        props.uniqueSuffix,
      ]),
      description: 'Attribute group for solution information',
      attributes: {
        applicationType: props.applicationType,
        version: props.solutionVersion,
        solutionID: props.solutionId,
        solutionName: props.solutionName,
      },
    });

    const cfnAttributeGroup = attributeGroup.node.defaultChild as CfnAttributeGroup;
    overrideLogicalId(cfnAttributeGroup, 'DefaultApplicationAttributeGroup');

    const cfnAttributeGroupAssociation = new CfnAttributeGroupAssociation(this, 'AttributeGroupAssociation', {
      application: application.applicationId,
      attributeGroup: attributeGroup.attributeGroupId,
    });
    overrideLogicalId(cfnAttributeGroupAssociation, 'AppRegistryApplicationAttributeAssociation');

    // Tags for application

    Tags.of(application).add('Solutions:SolutionID', props.solutionId);
    Tags.of(application).add('Solutions:SolutionName', props.solutionName);
    Tags.of(application).add('Solutions:SolutionVersion', props.solutionVersion);
    Tags.of(application).add('Solutions:ApplicationType', props.applicationType);
  }
}
