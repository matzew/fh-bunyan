'use strict';

var clone = require('lodash.clone')
  , env = require('get-env');

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
  mapping = clone(map);
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
  return clone(mapping);
};
