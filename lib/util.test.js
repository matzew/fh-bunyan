'use strict';

var proxyquire = require('proxyquire')
  , expect = require('chai').expect
  , sinon = require('sinon');

describe(__filename, function () {

  var mod, envGetStub, getMappingStub;

  beforeEach(function () {
    envGetStub = sinon.stub();
    getMappingStub = sinon.stub();

    delete require.cache[require.resolve('./util.js')];
    mod = proxyquire('./util.js', {
      './log-levels': {
        getMapping: getMappingStub
      },
      'get-env': envGetStub
    });

    // Return some defaults
    getMappingStub.returns({
      dev: 'trace',
      test: 'debug',
      preprod: 'info',
      prod: 'info'
    });
  });

  describe('#generateName', function () {
    it('should return a trimmed name', function () {
      expect('/lib/util.test.js').to.equal(mod.generateName(__filename));
    });
  });

  describe('#getLogLevel', function () {
    it('should return "info"', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('prod');
      expect(mod.getLogLevel()).to.equal('info');
    });

    it('should return "trace"', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('dev');
      expect(mod.getLogLevel()).to.equal('trace');
    });

    it('should return "debug"', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('test');
      expect(mod.getLogLevel()).to.equal('debug');
    });

    it('should return "info"', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('preprod');
      expect(mod.getLogLevel()).to.equal('info');
    });

    it('should return "info" by default', function () {
      envGetStub.onCall(0).returns(false);
      envGetStub.returns('not-valid-value');
      expect(mod.getLogLevel()).to.equal('info');
    });
  });

  describe('#getStreams', function () {
    it('should return an array of default streams', function () {
      expect(mod.getStreams()).to.have.length(2);
    });

    it('should return an array of streams, plus a custom stream', function () {
      expect(mod.getStreams([{
        level: 'info',
        stream: process.stdout
      }])).to.have.length(3);
    });
  });


});
