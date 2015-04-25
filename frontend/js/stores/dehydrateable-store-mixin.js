var Reflux = require('reflux');
var isServer = require('../util/is-server');
var rehydrator = require('../client/rehydrator');

module.exports = {
  init: function() {
    if (!isServer) {
      hydrate.call(this);
    }
  },

  isStore: true
};

function hydrate() {
  if (!this.rehydrate || !this.hydrationKey) {
    throw new Error("Store " + this + " did not specify a rehydration key or rehydrate method");
  }

  var rehydratedData = rehydrator.get(this.hydrationKey);

  if (rehydratedData) {
    this.rehydrate(rehydratedData);
  }
}