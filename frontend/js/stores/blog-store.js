var Reflux = require('reflux');
var DehydrateableStoreMixin = require('./dehydrateable-store-mixin');
var BlogActionsModule = require('../actions/blog-actions');

exports.constructor = function (ctx) {
  "use strict";

  var blogActions = ctx.injectSingleton(BlogActionsModule);

  var blogs = {};

  var BlogStore = Reflux.createStore({
    mixins: [DehydrateableStoreMixin],
    hydrationKey: 'blog-store',

    init: function () {
      this.listenTo(blogActions.loadBlog.completed, this.onBlogLoad);
    },

    dehydrate: function () {
      return blogs;
    },

    rehydrate: function (dehydratedData) {
      blogs = dehydratedData;
    },

    getBlog: function (blogId) {
      return blogs[blogId];
    },

    onBlogLoad: function(blogId, blog) {
      blogs[blogId] = blog;
      this.trigger();
    }
  });

  return BlogStore;
};

exports.singletonKey = 'blog-store';