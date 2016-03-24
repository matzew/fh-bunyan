'use strict';

var clone = require('lodash.clone')
  , env = require('get-env')
  , customMapping = null;


function generateDefaultMappings () {
  // Some domains have an environment prefix, we need to determine what that is
  var envPrefix = (
    env('FH_ENV', '').split('-').length === 2
  ) ? env('FH_ENV', '').split('-')[0] : '';

  // Default mappings
  var mapping = {
    dev: 'trace',
    test: 'debug',
    preprod: 'info',
    prod: 'info',
  };

  // Generate possible environments with prefix e.g dev => ps-dev if required
  if (envPrefix) {
    Object.keys(mapping).forEach(function (key) {
      mapping[envPrefix + '-' + key] = mapping[key];

      // Delete older mapping since it's not relevant
      delete mapping[key];
    });
  }

  return mapping;
}


/**
 * Relates FH_ENV values to logger levels. Example input:
 *
 * {
 *   dev: 'trace',
 *   test: 'debug',
 *   preprod: 'info',
 *   prod: 'info',
 * }
 *
 * @param {Object} map
 */
exports.setMapping = function (map) {
  customMapping = clone(map);
};


/**
 * Returns a mappings being used for log levels.
 *
 * A clone of the inernal object is retuned to prevennt issues with devs
 * modifying the returned object.
 *
 * @return {Object}
 */
exports.getMapping = function () {
  if (customMapping) {
    return clone(customMapping);
  } else {
    return generateDefaultMappings();
  }
};


/**
 * Get the appropriate log level for the current FH_ENV
 * @return {String}
 */
exports.getLogLevel = function () {
  var isLocal = env('FH_USE_LOCAL_DB')
    , envVarLevel = env('BUNYAN_FH_LEVEL');

  if (isLocal) {
    // We always use trace during local development
    return 'trace';
  } else if (envVarLevel) {
    // Use the value in an env var
    return envVarLevel;
  } else {
    // Otherwise we go with the FH_ENV mapping, or "info" it that fails
    return exports.getMapping()[env('FH_ENV')] || 'info';
  }
};
