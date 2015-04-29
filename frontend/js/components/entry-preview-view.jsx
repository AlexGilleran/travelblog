var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = require('react-router/modules/components/Link');

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
          <div>
            <h3>
              <Link to="entries" params={this.props.entry}>{this.props.entry.title}</Link>
            </h3>
          </div>
          <div>{this.props.entry.markdown}</div>
        </div>
      );
    }
  });
};

exports.singletonKey = 'entry-preview-view';