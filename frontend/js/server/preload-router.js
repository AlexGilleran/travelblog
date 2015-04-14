var debug = require('debug')('api-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogActionsModule = require('../actions/blog-actions');

var router = {
  '/': function * (state) {

  },

  '/blog/:blogId': function * () {
    "use strict";

    this.injectionContext.injectSingleton(BlogStoreModule);

    var blogActions = this.injectionContext.injectSingleton(BlogActionsModule);

    blogActions.loadBlog(state.params.blogId);
  }
};

module.exports = router;