var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var BlogListStoreModule = require('../stores/blog-list-store');
var BlogActionsModule = require('../actions/blog-actions');
var EntryPreviewViewModule = require('../components/entry-preview-view');

exports.constructor = function (ctx) {
  "use strict";

  var blogListStore = ctx.injectSingleton(BlogListStoreModule);
  var blogActions = ctx.injectSingleton(BlogActionsModule);

  return React.createClass({
    mixins: [Router.State, Reflux.ListenerMixin],

    getInitialState: function () {
      return {
        blogs: blogListStore.getBlogList() || []
      }
    },

    componentWillMount: function () {
      this.listenTo(blogListStore, this.onBlogsChanged);
    },

    onBlogsChanged: function () {
      this.setState({
        blogs: blogListStore.getBlogList() || []
      });
    },

    render: function () {
      return (
        <div>
          <For each="blog" of={this.state.blogs}>
            <div>{blog.name}</div>
          </For>
        </div>
      );
    }
  });
};

exports.singletonKey = 'blog-list-view';