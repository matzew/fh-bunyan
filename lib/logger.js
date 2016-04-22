'use strict';

var bunyan = require('bunyan')
  , levels = require('./log-levels')
  , util = require('./util.js')
  , env = require('env-var');


exports.setLogMappings = levels.setMapping.bind(levels);

/**
 * Returns a logger instance with the given name
 * @param  {String|Object} Either the logger name, or an options object
 * @return {Object}
 */
exports.getLogger = function (opts) {
  if (typeof opts === 'string') {
    opts = {
      name: opts,
      streams: []
    };
  }

  var logger = bunyan.createLogger({
    name: util.generateName(opts.name),
    level: levels.getLogLevel()
  });

  // Need to replace internal streams that bunyan adds by default
  logger.streams = [];

  /* istanbul ignore else */
  if (env('NODE_ENV', '') !== 'test') {
    util.getStreams(opts.streams).forEach(logger.addStream.bind(logger));
  }

  return logger;
};
