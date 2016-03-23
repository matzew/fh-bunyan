'use strict';

var expect = require('chai').expect
  , sinon = require('sinon')
  , proxyquire = require('proxyquire');

describe(__filename, function () {
  var mod, testMap, envStub;

  beforeEach(function () {
    delete require.cache[require.resolve('./log-levels.js')];
    envStub = sinon.stub();

    envStub.returns('dev');

    mod = function () {
      return proxyquire('./log-levels.js', {
        'get-env': envStub
      });
    };

    testMap = {
      dev: 'trace',
      test: 'debug',
      preprod: 'info',
      prod: 'info',
    };
  });

  describe('#setMapping', function () {
    it('should run successfully', function () {
      mod().setMapping(testMap);
    });
  });

  describe('#getMapping', function () {
    it('should return defaults sans prefix', function () {
      expect(mod().getMapping()).to.deep.equal({
        dev: 'trace',
        test: 'debug',
        preprod: 'info',
        prod: 'info',
      });
    });

    it('should return defaults with prefix', function () {
      envStub.returns('ps-dev');

      expect(mod().getMapping()).to.deep.equal({
        'ps-dev': 'trace',
        'ps-test': 'debug',
        'ps-preprod': 'info',
        'ps-prod': 'info',
      });
    });

    it('should return custom values', function () {
      mod().setMapping(testMap);

      // This will not be equal since a clone is returned
      expect(mod().getMapping()).to.not.equal(testMap);

      // Deep equal should be true since they have same key and vals
      expect(mod().getMapping()).to.deep.equal(testMap);
    });
  });

});
