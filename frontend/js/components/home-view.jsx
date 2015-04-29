var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var BlogListViewModule = require('./blog-list-view');

exports.constructor = function (ctx) {
  "use strict";

  var BlogListView = ctx.injectSingleton(BlogListViewModule);

  return React.createClass({
    mixins: [Router.State, Reflux.ListenerMixin],

    getInitialState: function () {
      return {};
    },

    componentWillMount: function () {
    },

    onBlogChanged: function () {
    },

    componentWillReceiveProps: function (newProps) {
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    render: function () {
      return (
        <div>
          <div className="col-2-3">
            Home
          </div>
          <div className="col-1-3">
            <BlogListView />
          </div>
        </div>
      );
    }
  });
};

exports.singletonKey = 'home-view';