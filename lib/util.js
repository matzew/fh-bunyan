'use strict';

var levels = require('./log-levels');

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
 * Returns the default set of streams each logger should use plus any custom
 * streams added by a user
 * @return {Array}
 */
exports.getStreams = function (injectedStreams) {
  return [{
    stream: process.stdout,
    level: levels.getLogLevel()
  }, {
    stream: process.stderr,
    level: 'error'
  }].concat(injectedStreams || []);
};
