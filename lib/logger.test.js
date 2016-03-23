'use strict';

var expect = require('chai').expect;

describe(__filename, function () {

  var mod = null
    , l = null
    , envStub = null;

  beforeEach(function () {
    delete require.cache[require.resolve('./logger.js')];

    envStub = require('sinon').stub();

    mod = require('proxyquire')('./logger.js', {
      'get-env': envStub
    });

    l = mod.getLogger({
      name: 'test'
    });
  });

  describe('#getLogger', function () {
    it('should return a logger instance from opts argument', function (done) {
      envStub.returns('dev');

      // Verify this is a logger...loosely
      expect(l.info).to.be.a('function');
      expect(l.fatal).to.be.a('function');
      expect(l.warn).to.be.a('function');
      expect(l.error).to.be.a('function');
      expect(l.debug).to.be.a('function');

      done();
    });

    it('should return a logger instance from string argument', function (done) {
      envStub.returns('dev');

      var l = mod.getLogger('test');

      // Verify this is a logger...loosely
      expect(l.info).to.be.a('function');
      expect(l.fatal).to.be.a('function');
      expect(l.warn).to.be.a('function');
      expect(l.error).to.be.a('function');
      expect(l.debug).to.be.a('function');

      done();
    });

    it('should return a logger with no streams', function () {
      envStub.returns('test');

      var l = mod.getLogger('test');

      // Verify this is a logger...loosely
      expect(l.info).to.be.a('function');
      expect(l.fatal).to.be.a('function');
      expect(l.warn).to.be.a('function');
      expect(l.error).to.be.a('function');
      expect(l.debug).to.be.a('function');

      expect(l.streams).to.have.length(0);
    });
  });

});
