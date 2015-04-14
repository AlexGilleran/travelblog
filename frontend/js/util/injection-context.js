var React = require('react');
var Reflux = require('reflux');
var debug = require('debug')('injection-context');

/**
 * Ghetto dependency injection. Each instance keeps a map of singleton instances. Objects injected must export a
 * "constructor" function to create themselves, and to be injected as a singleton they must also export a "key" string.
 */
module.exports = function() {
  var singletons = {};
  var stores = [];
  var context = {};

  this.injectSingleton = function(mod) {
    var key = mod.singletonKey;

    if (!key) {
      throw new Error("Attempted to inject a module without a key! " + mod);
    }

    if (!singletons[key]) {
      // debug('Miss for ' + key + '! Current cache: ' + JSON.stringify(Object.keys(singletons)));
      singletons[key] = mod.constructor(this);

      if (singletons[key].isStore) {
        stores.push(singletons[key]);
      }
    }

    return singletons[key];
  };

  this.injectNew = function(mod) {
    return mod.constructor(this);
  };

  this.getStores = function() {
    return stores;
  };
};