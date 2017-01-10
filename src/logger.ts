
var winston = require('winston');

const tsFormat = () => (new Date()).toLocaleTimeString();
export const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
    })
  ]
});

// specify log level
// logger.level = 'debug'; // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

// specify fil logging etc

// import {logger} from "./logger";
// logger.info('Hello world');
// logger.debug('Debugging info');