# Change Log
 All notable changes to this project will be documented in this file.
 
 The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
 and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-05
 ### Fixed
 - Added new CFN parameter to support optional creation of QS user groups to resolve the [issue](https://github.com/aws-solutions/security-insights-on-aws/issues/2)
 - Fixed the security widget for Findings by Standards.
 - Updated the sort order for Security Hub widget.
 - Added filters to CloudTrail widgets.
 - Updated the error logging to return errors to CFN console.

## [1.0.0] - 2024-03
 ### Added
 - Added feature to show QuickSight Analysis for data source vpc, cloudtrail, security hub.
 - Added feature to refresh QuickSight datasets.
 - Added feature to support error notifications for Athena query errors.
 - Added feature to provision QuickSight User Groups.
 - Added CloudWatch Alarm for monitoring Athena data usage.

