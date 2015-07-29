var React = require('react');

module.exports = class BlogImage extends React.Component {
  render() {
    return (<img alt={this.props.element.alt} src={this.props.element.url}/>);
  }
};