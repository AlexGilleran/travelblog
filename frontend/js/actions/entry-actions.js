var Reflux = require('reflux');
var api = require('../api');
var bindToApi = require('../util/bind-to-api');

exports.constructor = function (ctx) {
  var EntryActions = Reflux.createActions({
    'createEntry': {asyncResult: true},
    'loadEntry': {asyncResult: true}
  });

  EntryActions.createEntry.listen(bindToApi(api.createEntry));
  EntryActions.loadEntry.listen(bindToApi(api.getEntry));

  return EntryActions;
}

exports.singletonKey = 'entry-actions';