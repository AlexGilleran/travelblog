import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import LoginMutation from '../../mutations/login-mutation';

class LoginView extends React.Component {
  onSubmit(event) {
    event.preventDefault();

    const email = this.emailTextbox.value;
    const password = this.passwordTextbox.value;

    fetch('/api/users/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailAddress: email,
        password
      })
    }).then(() => {
      this.props.relay.commitUpdate(
        new LoginMutation({viewer: this.props.viewer})
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
        <If condition={this.props.viewer.currentUser}>
          <span>Logged in.</span>
          <Else />
          <form onSubmit={this.onSubmit.bind(this)}>
            <input type="text" placeholder="Email Address" ref={node => this.emailTextbox = node}/>
            <input type="password" placeholder="Password" ref={node => this.passwordTextbox = node}/>
            <input type="submit" value="Login"/>
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
        currentUser {
          userId
        }
      }
    `
  },
});