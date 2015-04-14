var React = require('react');
var _ = require('lodash');
var Router = require('react-router');
var RouteHandler = require('react-router').RouteHandler;

exports.constructor = function (ctx) {
  "use strict";

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
          <RouteHandler />
        </div>
      );
    }
  });
};

exports.singletonKey = 'root-view';