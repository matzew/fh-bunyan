'use strict';

var env = require('get-env')
  , levels = require('./log-levels');


/**
 * Generate a logger name that does not incldue uneccessary absolute path data
 * should developers choose to pass __filename
 * @param  {String} n
 * @return {String}
 */
exports.generateName = function (n) {
  return n.replace(process.cwd(), '');
};


/**
 * Get the appropriate log level for the current FH_ENV
 * @return {String}
 */
exports.getLogLevel = function () {
  if (env('FH_USE_LOCAL_DB') || !env('FH_ENV')) {
    // We always use trace during local development
    return 'trace';
  } else {
    // Otherwise we go with the FH_ENV mapping, or "info" it that fails
    return levels.getMapping()[env('FH_ENV')] || 'info';
  }
};


/**
 * Returns the default set of streams each logger should use plus any custom
 * streams added by a user
 * @return {Array}
 */
exports.getStreams = function (injectedStreams) {
  return [{
    stream: process.stdout,
    level: exports.getLogLevel()
  }, {
    stream: process.stderr,
    level: 'error'
  }].concat(injectedStreams || []);
};
