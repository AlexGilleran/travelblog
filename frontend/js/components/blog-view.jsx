var newMoment = require('moment');
var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogActionsModule = require('../actions/blog-actions');
var BlogListViewModule = require('./blog-list-view');
var EntryPreviewViewModule = require('./entry-preview-view');

exports.constructor = function (ctx) {
  "use strict";

  var blogStore = ctx.injectSingleton(BlogStoreModule);
  var blogActions = ctx.injectSingleton(BlogActionsModule);
  var EntryPreviewView = ctx.injectSingleton(EntryPreviewViewModule);
  var BlogListView = ctx.injectSingleton(BlogListViewModule);

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
      blogActions.loadBlog(this.getParams().blogId);
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
          <div className="col-2-3">
            <If condition={this.state.blog}>
              <div>
                <div>
                  <h2>{this.state.blog.details.name}</h2>
                </div>
                <For each="entry" of={this.state.blog.entries}>
                  <EntryPreviewView key={entry.entryId} entry={entry}/>
                </For>
              </div>
            </If>
          </div>
          <div className="col-1-3">
            <BlogListView />
          </div>
        </div>
      );
    }
  });
};

exports.singletonKey = 'blog-view';