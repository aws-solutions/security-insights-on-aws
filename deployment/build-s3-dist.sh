#!/usr/bin/env bash
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0
[[ "$TRACE" ]] && set -x
set -eo pipefail

header() {
  declare text=$1
  echo "------------------------------------------------------------------------------"
  echo "$text"
  echo "------------------------------------------------------------------------------"
}

usage() {
  echo "Please provide the base template-bucket, source-bucket-base-name, trademark-approved-solution-name, version, template_account_id, dist_quicksight_namespace"
  echo "For example: ./deployment/build-s3-dist.sh solutions solutions-code trademarked-solution-name v2.2, 1111111111111 solutions"
}

pack_lambda() {
  # Pack source_dir/package_name into build_dist_dir/package_name.zip with included files
  local source_dir=$1; shift
  local package_name=$1; shift
  local build_dist_dir=$1; shift
  local includes="$@"

  local package_temp_dir="$build_dist_dir"/"$package_name"
  [[ -d "$package_temp_dir" ]] && rm -r "$package_temp_dir"
  mkdir -p "$package_temp_dir"
  
  cp -r "$source_dir"/"$package_name"/dist/. "$package_temp_dir"
  
  for include_file in ${includes[@]}; do
    cp "$include_file" "$package_temp_dir"
  done

  pushd "$package_temp_dir"
  local exclude_dirs=( "__tests__")
  for exclude_dir in ${exclude_dirs[@]}; do
    find . -type d -name "$exclude_dir" | xargs rm -rf
  done

  echo "Packed lambda $package_name contents:"
  ls -AlR
  zip -q -r9 "$build_dist_dir"/"$package_name".zip .

  popd
  rm -r "$package_temp_dir"
}

# ./deployment/build-s3-dist.sh source-bucket-base-name trademarked-solution-name version-code
#
# Parameters:
#  - template-bucket: Name for the S3 bucket location where the templates are found
#  - source-bucket-base-name: Name for the S3 bucket location where the Lambda source
#    code is deployed. The template will append '-[region_name]' to this bucket name.
#  - trademarked-solution-name: name of the solution for consistency
#  - version-code: version of the package
#
#    For example: ./deployment/build-s3-dist.sh template-bucket source-bucket-base-name my-solution v2.2
#    The template will then expect the source code to be located in the solutions-[region_name] bucket
# TODO: wiq remove below comments to help with local runs when merging with develop
# ./build-s3-dist.sh solutions-features-reference solutions-features security-insights-on-aws v1.0.0
# export TEMPLATE_OUTPUT_BUCKET=solutions-features-reference
# export DIST_OUTPUT_BUCKET=solutions-features
# export SOLUTION_NAME=security-insights-on-aws
# export VERSION=v1.0.0

main() {
  declare template_bucket=$1 source_bucket=$2 solution=$3 version=$4 template_account_id=$5 dist_quicksight_namespace=$6
  echo "template bucket = $template_bucket"
  echo "source bucket = $source_bucket"
  echo "solution = $solution"
  echo "version = $version"
  echo "template_account_id = $template_account_id"
  echo "dist_quicksight_namespace = $dist_quicksight_namespace"
  
  if [ -z "$template_bucket" ] || [ -z "$source_bucket" ] || [ -z "$solution" ] || [ -z "$version" ] || [ -z "$template_account_id" ] || [ -z "$dist_quicksight_namespace" ]; then
    echo "Please provide all required parameters for the build script"
    echo "For example: ./build-s3-dist.sh solutions trademarked-solution-name v1.2.0 template-bucket-name template_account_id solutions"
    usage
    exit 1
  fi

  dashed_version="${version//./$'_'}"

  echo "template bucket = $template_bucket"
  echo "source bucket = $source_bucket"
  echo "solution = $solution"
  echo "version = $version"
  echo "template_account_id = $template_account_id"
  echo "dist_quicksight_namespace = $dist_quicksight_namespace"

  local root_dir=$(dirname "$(cd -P -- "$(dirname "$0")" && pwd -P)")
  local template_dir="$root_dir"/deployment
  local source_dir="$root_dir"/source

  local template_dist_dir="$template_dir"/global-s3-assets
  local build_dist_dir="$template_dir"/regional-s3-assets

  header "[Init] Clean old dist and template folders"

  local clean_directories=("$template_dist_dir" "$build_dist_dir")
  for dir in ${clean_directories[@]}; do
    rm -rf "$dir"
    mkdir -p "$dir"
  done

  header "[Packing] Templates"

  echo "Updating tokens in template with token values"
  echo "Setting env variables"
  export SOLUTION_VERSION=$version SOLUTION_NAME=$solution DIST_OUTPUT_BUCKET=$source_bucket SOLUTION_TRADEMARKEDNAME=$solution TEMPLATE_ACCOUNT_ID=$template_account_id DIST_QUICKSIGHT_NAMESPACE=$dist_quicksight_namespace DASHED_VERSION=$dashed_version

  local replace_regexes=(
    "s/%TEMPLATE_BUCKET_NAME%/$template_bucket/g"
    "s/%DIST_BUCKET_NAME%/$source_bucket/g"
    "s/%SOLUTION_NAME%/$solution/g"
    "s/%VERSION%/$version/g"
    "s/%TEMPLATE_ACCOUNT_ID%/$template_account_id/g"
    "s/%DIST_QUICKSIGHT_NAMESPACE%/$dist_quicksight_namespace/g"
    "s/%DASHED_VERSION%/$dashed_version/g"

  )
  replace_args=()
  for regex in ${replace_regexes[@]}; do
    replace_args=(-e "$regex" "${replace_args[@]}")
  done

  cd $source_dir/resources
  npm install
  npx cdk synth security-insights-on-aws >> "$template_dir"/security-insights-on-aws.template
  templates=(security-insights-on-aws.template)
  
  for template in ${templates[@]}; do
    sed ${replace_args[@]} "$template_dir"/"$template" > "$template_dist_dir"/"$template"
    rm  "$template_dir"/"$template"
  done

  header "[Packing] lambda code"

  pack_lambda "$source_dir"/services createQuickSightDataSets "$build_dist_dir" 
  pack_lambda "$source_dir"/services createQuickSightDataSetRefreshSchedules "$build_dist_dir" 
  pack_lambda "$source_dir"/services createLakeFormationPermissions "$build_dist_dir"
  pack_lambda "$source_dir"/services quickSightUserGroupManager  "$build_dist_dir" 
  pack_lambda "$source_dir"/services sendAthenaMetrics "$build_dist_dir"
  pack_lambda "$source_dir"/services uuidGenerator "$build_dist_dir"
  pack_lambda "$source_dir"/services setAthenaThresholdValue "$build_dist_dir"

}

main "$@"