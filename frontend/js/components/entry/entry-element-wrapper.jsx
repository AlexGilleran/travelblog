var React = require('react');

module.exports = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  render: function () {
    return (
      <p>
        {this.props.children}
      </p>
    );
  }
});