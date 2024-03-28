// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createLogger, transports, format } from 'winston';
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, label, message }) => {
  const _level = level.toLowerCase();
  if (label) {
    return `[${_level}] [${label}] ${JSON.stringify(message)}`;
  } else {
    return `[${_level}] ${message}`;
  }
});

export const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
      handleExceptions: true, //handle uncaught exceptions
    }),
  ],
});
