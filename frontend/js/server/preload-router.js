var debug = require('debug')('api-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogListStoreModule = require('../stores/blog-list-store');
var BlogActionsModule = require('../actions/blog-actions');
var EntryStoreModule = require('../stores/entry-store');
var EntryActionsModule = require('../actions/entry-actions');

"use strict";

var router = {
  '/': function * (state) {
    var blogActions = this.injectionContext.injectSingleton(BlogActionsModule);
    this.injectionContext.injectSingleton(BlogListStoreModule);

    yield blogActions.loadBlogList.triggerPromise();
  },

  '/blogs/:blogId': function * (state) {
    var blogActions = this.injectionContext.injectSingleton(BlogActionsModule);

    this.injectionContext.injectSingleton(BlogStoreModule);

    yield blogActions.loadBlog.triggerPromise(state.params.blogId);
  },

  '/entries/:entryId': function * (state) {
    var entryActions = this.injectionContext.injectSingleton(EntryActionsModule);

    this.injectionContext.injectSingleton(EntryStoreModule);

    yield entryActions.loadEntry.triggerPromise(state.params.entryId);
  }
};

module.exports = router;