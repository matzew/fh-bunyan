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
        'env-var': envStub
      });
    };

    testMap = {
      dev: 'trace',
      test: 'debug',
      preprod: 'info',
      prod: 'info',
    };
  });

  describe('#getLogLevel', function () {
    it('should return "info"', function () {
      envStub.withArgs('FH_USE_LOCAL_DB').returns('');
      envStub.withArgs('BUNYAN_FH_LEVEL').returns('');
      envStub.withArgs('FH_ENV').returns('prod');
      expect(mod().getLogLevel()).to.equal('info');
    });

    it('should return "trace"', function () {
      envStub.withArgs('FH_USE_LOCAL_DB').returns('');
      envStub.withArgs('BUNYAN_FH_LEVEL').returns('');
      envStub.withArgs('FH_ENV').returns('dev');
      expect(mod().getLogLevel()).to.equal('trace');
    });

    it('should return "debug"', function () {
      envStub.withArgs('FH_USE_LOCAL_DB').returns('');
      envStub.withArgs('BUNYAN_FH_LEVEL').returns('');
      envStub.withArgs('FH_ENV').returns('test');
      expect(mod().getLogLevel()).to.equal('debug');
    });

    it('should return "info"', function () {
      envStub.withArgs('FH_USE_LOCAL_DB').returns('');
      envStub.withArgs('BUNYAN_FH_LEVEL').returns('');
      envStub.withArgs('FH_ENV').returns('preprod');
      expect(mod().getLogLevel()).to.equal('info');
    });

    it('should return "info" by default', function () {
      envStub.withArgs('FH_USE_LOCAL_DB').returns('');
      envStub.withArgs('BUNYAN_FH_LEVEL').returns('');
      envStub.withArgs('FH_ENV').returns('invalid');
      expect(mod().getLogLevel()).to.equal('info');
    });

    it('should return the value in BUNYAN_FH_LEVEL', function () {
      envStub.withArgs('FH_USE_LOCAL_DB').returns('');
      envStub.withArgs('BUNYAN_FH_LEVEL').returns('info');
      expect(mod().getLogLevel()).to.equal('info');
    });
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
      var lvls = mod();

      lvls.setMapping(testMap);

      // This will not be equal since a clone is returned
      expect(lvls.getMapping()).to.not.equal(testMap);

      // Deep equal should be true since they have same key and vals
      expect(lvls.getMapping()).to.deep.equal(testMap);
    });


  });

});
