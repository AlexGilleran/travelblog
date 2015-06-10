var React = require('react');
var {RouteHandler} = require('react-router');
var HeaderView = require('./header-view');

export default class RootView {
  render() {
    return (
      <div>
        <HeaderView flux={this.props.flux} />
        <RouteHandler {...this.props} />
      </div>
    );
  }
}