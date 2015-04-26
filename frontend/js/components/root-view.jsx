var React = require('react');
var Router = require('react-router');
var RouteHandler = require('react-router').RouteHandler;
var HeaderViewModule = require('./header-view');

exports.constructor = function (ctx) {
  "use strict";

  var HeaderView = ctx.injectSingleton(HeaderViewModule);

  return React.createClass({
    mixins: [Router.State],

    getInitialState: function () {
      return {};
    },

    componentDidMount: function () {

    },

    render: function () {
      return (
        <div>
          <HeaderView />
          <RouteHandler />
        </div>
      );
    }
  });
};

exports.singletonKey = 'root-view';