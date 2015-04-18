var debug = require('debug')('api-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogListStoreModule = require('../stores/blog-list-store');
var BlogActionsModule = require('../actions/blog-actions');

"use strict";

var router = {
  '/': function * (state) {
    var blogActions = this.injectionContext.injectSingleton(BlogActionsModule);
    this.injectionContext.injectSingleton(BlogListStoreModule);

    // TODO: Yield to all these at once
    yield blogActions.loadBlogList.triggerPromise();
  },

  '/blogs/:blogId': function * (state) {
    var blogActions = this.injectionContext.injectSingleton(BlogActionsModule);

    this.injectionContext.injectSingleton(BlogStoreModule);

    yield blogActions.loadBlog.triggerPromise(state.params.blogId);
  }
};

module.exports = router;