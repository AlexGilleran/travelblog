var React = require('react');
var {RouteHandler} = require('react-router');
var HeaderView = require('./header-view');

export default class RootView extends React.Component {
  render() {
    return (
      <div>
        {/*<HeaderView flux={this.props.flux}/>
        {this.props.children}*/}
      </div>
    );
  }
}