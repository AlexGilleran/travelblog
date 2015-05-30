var debug = require('debug')('api-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogListStoreModule = require('../stores/blog-list-store');
var BlogActions = require('../actions/blog-actions');
var EntryStoreModule = require('../stores/entry-store');
var EntryActionsModule = require('../actions/entry-actions');

"use strict";

var router = {
  '/': function * (state) {
    yield this.flux.getActions('blog').getBlogList();
  },

  '/blogs/:blogId': function * (state) {
    yield this.flux.getActions('blog').getBlog(state.params.blogId);
  },

  '/entries/:entryId': function * (state) {
    yield this.flux.getActions('entry').getEntry(state.params.entryId);
  }
};

module.exports = router;