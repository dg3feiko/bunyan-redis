'use strict';

var redis = require('redis');
var vasync = require('vasync');
var events = require('events');
var stringify = require('json-stringify-safe');

/**
 * Create a new RedisTransport instance
 *
 * @param {Object} opts Transport options object
 * @param {String} opts.container Redis key
 * @param {Number} opts.length List max length
 * @param {String} opts.host Redis host
 * @param {Number} opts.port Redis port
 * @param {Number} opts.db Redis database index
 * @param {String} opts.password Redis password
 * @param {String} opts.rotation_interval, compliant with moment.js time duration format, by default no rotation
 * @param {Number} opts.drop_factor, by which overflowing items are dropped
 * @constructor
 */
function RedisTransport (opts) {

  this._container = opts.container || 'logs';
  this._length = opts.length || undefined;
  this._client = this.createClient(opts);
  this._drop_factor = opts.drop_factor;

  if(opts.rotation_interval)
  {

    var that = this;
    try
    {
      var sec = require('moment').duration(opts.rotation_interval).asSeconds();
      setInterval(function(){
        var new_client = that.createClient(opts);
        var old_client = that._client;
        that._client = new_client;
	    old_client.quit();
      },sec)
    }catch (e)
    {
      console.error(e)
    }
  }

}



RedisTransport.prototype = Object.create(events.EventEmitter.prototype);

RedisTransport.prototype.createClient = function(opts)
{

  var client = redis.createClient(opts.port, opts.host);

  // Authorize cleint
  if (opts.hasOwnProperty('password')) {
    client.auth(opts.password);
  }

  // Set database index
  if (opts.hasOwnProperty('db')) {
    client.select(opts.db);
  }

  return client;

};

/**
 * Push bunyan log entry to redis list
 *
 * @param {Object} entry
 */
RedisTransport.prototype.write = function write (entry) {
  var self = this;
  var client = this._client;

  this.emit('log', entry);

  vasync.pipeline({
    arg: {},
    funcs: [
      // Find list length
      function findListLength (args, next) {
        client.llen(self._container, function listLengthFound (err, length) {
          if (err) {
            return next(err);
          }

          args.length = length;
          return next(null, length);
        });
      },

      // Push data
      function pushEntryToList (args, next) {
        var data = stringify(entry, null, 2);
        client.lpush(self._container, data, function dataStored (err) {
          if (err) {
            return next(err);
          }

          return next();
        });
      },

      // Trim data list
      function trimList (args, next) {
        if (self._length === undefined || args.length <= self._length) {
          return next();
        }

        client.ltrim(self._container, 0, Math.ceil(self._length * (1 - self._drop_factor)), function dataStored (err) {
          if (err) {
            return next(err);
          }

          return next();
        });
      }
    ]
  }, function onEnd (err, results) {
    if (err) {
      return self.emit('error', err);
    }

    self.emit('logged', entry);
  });
};

module.exports = RedisTransport;