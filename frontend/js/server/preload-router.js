var debug = require('debug')('api-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogListStoreModule = require('../stores/blog-list-store');
var BlogActions = require('../actions/blog-actions');
var EntryStoreModule = require('../stores/entry-store');
var EntryActionsModule = require('../actions/entry-actions');

"use strict";

var router = {
  '/': function (state) {
    var actions = [this.flux.getActions('blog').getBlogList()];

    const sessionId = this.cookies.get('id');
    if (sessionId) {
      actions.push(this.flux.getActions('login-state').initWithSession(sessionId));
    }

    return actions;
  },

  '/blogs/:blogId': function (state) {
    return [this.flux.getActions('blog').getBlog(state.params.blogId)];
  },

  '/entries/:entryId': populateEntry,

  '/entries/:entryId/edit': populateEntry,

  '/users/:userId': function(state) {
    return [this.flux.getActions('user').getUser(state.params.userId)];
  }
};

function populateEntry(state) {
  return [this.flux.getActions('entry').getEntry(state.params.entryId)];
}

module.exports = router;