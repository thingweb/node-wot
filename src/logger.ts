/*
 * The MIT License (MIT)
 * Copyright (c) 2017 the thingweb community
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import winston = require('winston');

const tsFormat = () => (new Date()).toLocaleTimeString();

const consoleTransport = new winston.transports.Console({
  timestamp: tsFormat,  
  // colorize the output to the console
  colorize: true,
  humanReadableUnhandledException: true
});

const loggerOpts: winston.LoggerOptions = {
  transports: [
    consoleTransport
  ]
}

export const logger: winston.LoggerInstance = new winston.Logger(loggerOpts);

export default logger;

// specify log level
// logger.level = 'debug'; // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

// specify fil logging etc

// import {logger} from "./logger";
// logger.info('Hello world');
// logger.debug('Debugging info');