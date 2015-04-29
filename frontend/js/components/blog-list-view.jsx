var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var BlogListStoreModule = require('../stores/blog-list-store');
var Link = require('react-router/modules/components/Link');

exports.constructor = function (ctx) {
  "use strict";

  var blogListStore = ctx.injectSingleton(BlogListStoreModule);

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
            <div key={blog.blogId}>
              <Link to="blogs" params={blog}>{blog.name}</Link>
            </div>
          </For>
        </div>
      );
    }
  });
};

exports.singletonKey = 'blog-list-view';