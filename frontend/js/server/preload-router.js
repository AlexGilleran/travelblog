var debug = require('debug')('api-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogActionsModule = require('../actions/blog-actions');

var router = {
  '/': function * (state) {

  },

  '/blogs/:blogId': function * (state) {
    "use strict";

    this.injectionContext.injectSingleton(BlogStoreModule);
    var blogActions = this.injectionContext.injectSingleton(BlogActionsModule);

    yield blogActions.loadBlog.triggerPromise(state.params.blogId);
  }
};

module.exports = router;