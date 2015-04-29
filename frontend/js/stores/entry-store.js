var Reflux = require('reflux');
var DehydrateableStoreMixin = require('./dehydrateable-store-mixin');
var EntryActionsModule = require('../actions/entry-actions');

exports.constructor = function (ctx) {
  "use strict";

  var entryActions = ctx.injectSingleton(EntryActionsModule);

  var entries = {};

  var EntryStore = Reflux.createStore({
    mixins: [DehydrateableStoreMixin],
    hydrationKey: 'entry-store',

    init: function () {
      this.listenTo(entryActions.loadEntry.completed, this.onEntryLoaded);
    },

    dehydrate: function () {
      return entries;
    },

    rehydrate: function (dehydratedData) {
      entries = dehydratedData;
    },

    getEntry: function (entryId) {
      if (entries[entryId]) {
        return entries[entryId];
      } else {
        entryActions.loadEntry(entryId);
      }
    },

    onEntryLoaded: function(entry) {
      entries[entry.entryId] = entry;
      this.trigger();
    }
  });

  return EntryStore;
};

exports.singletonKey = 'entry-store';