var Reflux = require('reflux');
var DehydrateableStoreMixin = require('./dehydrateable-store-mixin');
var BlogActionsModule = require('../actions/blog-actions');

exports.constructor = function (ctx) {
  "use strict";

  var blogActions = ctx.injectSingleton(BlogActionsModule);

  var blogList;

  var BlogListStore = Reflux.createStore({
    mixins: [DehydrateableStoreMixin],
    hydrationKey: 'blog-list-store',

    init: function () {
      this.listenTo(blogActions.loadBlogList.completed, this.onBlogListLoaded);
    },

    dehydrate: function () {
      return blogList;
    },

    rehydrate: function (dehydratedData) {
      blogList = dehydratedData;
    },

    getBlogList: function () {
      if (blogList) {
        return blogList;
      } else {
        blogActions.loadBlogList();
      }
    },

    onBlogListLoaded: function(newBlogList) {
      blogList = newBlogList;
      this.trigger();
    }
  });

  return BlogListStore;
};

exports.singletonKey = 'blog-list-store';