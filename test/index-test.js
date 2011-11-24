var vows = require('vows');
var assert = require('assert');
var util = require('util');
var instagram = require('passport-instagram');


vows.describe('passport-instagram').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(instagram.version);
    },
  },
  
}).export(module);
