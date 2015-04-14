var newMoment = require('moment');
var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogActionsModule = require('../actions/blog-actions');

exports.constructor = function (ctx) {
  "use strict";

  var blogStore = ctx.injectSingleton(BlogStoreModule);
  var blogActions = ctx.injectSingleton(BlogActionsModule);

  return React.createClass({
    mixins: [Router.State, Reflux.ListenerMixin],

    getInitialState: function () {
      return {
        blog: blogStore.getBlog(this.getParams().blogId)
      }
    },

    componentWillMount: function () {
      this.listenTo(blogStore, this.onBlogChanged);
    },

    onBlogChanged: function () {
      this.setState({
        blog: blogStore.getBlog(this.getParams().blogId)
      });
    },

    componentWillReceiveProps: function (newProps) {
    },

    componentDidMount: function () {
      if (!this.state.blog) {
        blogActions.loadBlog(this.getParams().blogId);
      }
    },

    componentWillUnmount: function () {
    },

    render: function () {
      return (
        <div>
          {this.state.blog ? this.state.blog.details.name : ''}
        </div>
      );
    }
  });
};

exports.singletonKey = 'blog-view';