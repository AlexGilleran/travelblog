var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

exports.constructor = function (ctx) {
  "use strict";

  return React.createClass({
    getInitialState: function () {
      return {};
    },

    componentWillMount: function () {

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
          <div>{this.props.entry.title}</div>
          <div>{this.props.entry.markdown}</div>
        </div>
      );
    }
  });
};

exports.singletonKey = 'entry-preview-view';