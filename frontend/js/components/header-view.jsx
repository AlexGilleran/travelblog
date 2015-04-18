var newMoment = require('moment');
var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var BlogStoreModule = require('../stores/blog-store');
var BlogActionsModule = require('../actions/blog-actions');
var EntryPreviewViewModule = require('../components/entry-preview-view');

exports.constructor = function (ctx) {
  "use strict";

  var blogStore = ctx.injectSingleton(BlogStoreModule);
  var blogActions = ctx.injectSingleton(BlogActionsModule);
  var EntryPreviewView = ctx.injectSingleton(EntryPreviewViewModule);

  return React.createClass({
    mixins: [Router.State, Reflux.ListenerMixin],

    render: function () {
      return (
        <div className="col-1-1">
          <div className="content">
            <h1>Travel Blog</h1>
          </div>
        </div>
      );
    }
  });
};

exports.singletonKey = 'blog-view';