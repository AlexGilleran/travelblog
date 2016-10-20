import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import LoginMutation from '../../mutations/login-mutation';

class LoginView extends React.Component {
  onSubmit(event) {
    event.preventDefault();

    const email = React.findDOMNode(this.refs.email).value;
    const password = React.findDOMNode(this.refs.password).value;

    fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      body: {
        email, password
      }
    }).then(() => {
      this.props.relay.commitUpdate(
        new LoginMutation({email})
      );
    }).catch(e => {
      console.error(e)
    });
  }

  render() {
    return (
      <div>
        {/*<If condition={this.props.loginInProgress}>
            <span>Logging in...</span>
          </If>
          <If condition={this.props.loginFailed}>
            <span>Login failed: {this.props.loginFailureReason}</span>
          </If>*/}
          <If condition={this.props.loggedIn}>
            <span>Logged in.</span>
          <Else />
            <form onSubmit={this.onSubmit.bind(this)}>
              <input type="text" placeholder="Email Address" ref="email" />
              <input type="password" placeholder="Password" ref="password" />
              <input type="submit" value="Login" />
              <Link to="register">Sign Up</Link>
            </form>
        </If>
      </div>
    );
  }
}

export default Relay.createContainer(LoginView, {
  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        ${LoginMutation.getFragment('viewer')}
      }
    `
  },
});