import React from 'react';
import Relay from 'react-relay';
import LoginView from './login-view';
import { Link } from 'react-router';

class HeaderView extends React.Component {
  render() {
    return (
      <div className="col-1-1">
        <div className="content pull-left">
          <Link to="/">
            <h1>Blog</h1>
          </Link>
        </div>
        <div className="pull-right">
          <LoginView viewer={this.props.viewer}/>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(HeaderView, {
  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        ${LoginView.getFragment('viewer')}
      }
    `
  },
});