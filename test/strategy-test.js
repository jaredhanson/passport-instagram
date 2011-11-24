var vows = require('vows');
var assert = require('assert');
var util = require('util');
var InstagramStrategy = require('passport-instagram/strategy');


vows.describe('InstagramStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new InstagramStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named instagram': function (strategy) {
      assert.equal(strategy.name, 'instagram');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new InstagramStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        var body = '{"data": { "id": "1574083", "username": "snoopdogg", "first_name": "Snoop", "last_name": "Dogg", "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg", "bio": "This is my bio", "website": "http://snoopdogg.com", "counts": { "media": 1320, "follows": 420, "followed_by": 3410 } } }';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'instagram');
        assert.equal(profile.id, '1574083');
        assert.equal(profile.username, 'snoopdogg');
        assert.equal(profile.displayName, 'Snoop Dogg');
        assert.equal(profile.name.familyName, 'Dogg');
        assert.equal(profile.name.givenName, 'Snoop');
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new InstagramStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
  
}).export(module);
