'use strict';

var expect = require('chai').expect;

describe(__filename, function () {

  var mod = null
    , l = null;

  beforeEach(function () {
    delete require.cache[require.resolve('./logger.js')];
    mod = require('./logger.js');

    l = mod.getLogger({
      name: 'test'
    });
  });

  describe('#getLogger', function () {
    it('should return a logger instance from opts argument', function (done) {
      // Verify this is a logger...loosely
      expect(l.info).to.be.a('function');
      expect(l.fatal).to.be.a('function');
      expect(l.warn).to.be.a('function');
      expect(l.error).to.be.a('function');
      expect(l.debug).to.be.a('function');

      done();
    });

    it('should return a logger instance from string argument', function (done) {
      var l = mod.getLogger('test');

      // Verify this is a logger...loosely
      expect(l.info).to.be.a('function');
      expect(l.fatal).to.be.a('function');
      expect(l.warn).to.be.a('function');
      expect(l.error).to.be.a('function');
      expect(l.debug).to.be.a('function');

      done();
    });
  });

});
