'use strict';

var log = require('../lib/logger.js');

var logger = log.getLogger(__filename);

var err = new Error('test error');
logger.trace('test trace');
logger.debug('test debug');
logger.info('test info');
logger.warn('test warn');
logger.error(err, 'error', 'test error');
logger.fatal(err, 'fatal', 'test fatal');
