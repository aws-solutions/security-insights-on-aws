# Change Log
 All notable changes to this project will be documented in this file.
 
 The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
 and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

 ## [2.0.1] - 2024-11-27

### Changed

- Updated dependencies to address cross-spawn CVE-2024-21538

## [2.0.0] - 2024-10-03
 ### Added
  - Amazon Q Topics for the data sources Security Hub and CloudTrail
  - New widgets to QuickSight analysis and dashboard for Security Hub, CloudTrail and VPC Flow Logs
  - Feature to receive notifications when new release for solution is available
  - Applications feature to support centralized monitoring for the solution resources
 
 ### Removed
  - Old widgets from QuickSight analysis and dashboard for Security Hub, CloudTrail and VPC Flow Logs

## [1.0.2] - 2024-08
 ### Security
  - Upgrade `fast-xml-parser` to mitigate [CVE-2024-41818](https://nvd.nist.gov/vuln/detail/CVE-2024-41818)
  - Upgrade `braces` to mitigate [CVE-2024-4068](https://avd.aquasec.com/nvd/2024/cve-2024-4068/)

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

