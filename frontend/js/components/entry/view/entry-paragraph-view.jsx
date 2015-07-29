const React = require('react');
const parse = require('./parse-md-to-react');
const INLINE_FORMATTERS = require('../inline-formatters');

module.exports = React.createClass({
  getContents: function() {
    return parse(INLINE_FORMATTERS, this.props.element.text)[0];
  },

  render: function() {
    return (
      <span>
        {this.getContents()}
      </span>
    );
  }
});