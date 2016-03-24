'use strict';

var expect = require('chai').expect
  , sinon = require('sinon');

describe(__filename, function () {

  var mod, envGetStub, getMappingStub;

  beforeEach(function () {
    envGetStub = sinon.stub();
    getMappingStub = sinon.stub();

    delete require.cache[require.resolve('./util.js')];
    mod = require('./util.js');

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
