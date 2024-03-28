// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const createDelayInSeconds = async (seconds: number) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000)); // convert to milliseconds
};
