#!/bin/bash
#
# This assumes all of the OS-level configuration has been completed and git repo has already been cloned
#
# This script should be run from the repo's deployment directory
# cd deployment
# ./run-unit-tests.sh
#
# set -e
# set -o pipefail
[ "$DEBUG" == 'true' ] && set -x
set -e
# Get reference for all important folders
template_dir="$PWD"
resource_dir="$template_dir/../source/resources"
source_dir="$template_dir/../source/services"

declare -a lambda_dirs=("createLakeFormationPermissions" "createQuickSightDataSetRefreshSchedules" "quickSightUserGroupManager" "sendAthenaMetrics" "uuidGenerator" "createQuickSightDataSets" "setAthenaThresholdValue")


build_binaries(){
    for lambda_dir in "${lambda_dirs[@]}"
    do
        echo "$lambda_dir"
        echo "------------------------------------------------------------------------------"
        echo "[Build] ${lambda_dir}"
        echo "------------------------------------------------------------------------------"
        
        cp -r $source_dir/utils $source_dir/$lambda_dir
        cd $source_dir/$lambda_dir
        npm run build:all
        if [ "$?" = "1" ]; then
            echo "(cd $source_dir/$lambda_dir; npm run test) ERROR: there is likely output above." 1>&2
            exit 1
        fi
    done
}

run_unit_tests(){
    for lambda_dir in "${lambda_dirs[@]}"
    do
        echo "$lambda_dir"
        echo "------------------------------------------------------------------------------"
        echo "[Test] $lambda_dir ${lambda_dir}"
        echo "------------------------------------------------------------------------------"

        cd $source_dir/$lambda_dir
        npm audit fix
        npm run test
        if [ "$?" = "1" ]; then
            echo "(cd $source_dir/$lambda_dir; npm run test) ERROR: there is likely output above." 1>&2
            exit 1
        fi
    done

    cd "$resource_dir"
    npm install
    npm run test
}

build_binaries
run_unit_tests