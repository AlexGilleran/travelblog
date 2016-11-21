import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import UpdateCurrentUserMutation from '../../../mutations/refresh-current-user-mutation';
import LoggedInStatus from './logged-in-status';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
`;

const LoggedInStatusWrapper = styled.div`
  margin-right: 5px;
`;

class HeaderMenu extends React.Component {
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
        new UpdateCurrentUserMutation({viewer: this.props.viewer})
      );
    }).catch(e => {
      console.error(e)
    });
  }

  logout() {
    fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'same-origin'
    }).then(() => {
      this.props.relay.commitUpdate(
        new UpdateCurrentUserMutation({viewer: this.props.viewer})
      );
    }).catch(e => {
      console.error(e)
    });
  }

  render() {
    return (
      <Choose>
        <When condition={this.props.viewer.currentUser}>
          <Root>
            <LoggedInStatusWrapper>
              <LoggedInStatus user={this.props.viewer.currentUser}/>
            </LoggedInStatusWrapper>
            {/*<button onClick={this.logout.bind(this)}>Logout</button>*/}
          </Root>
        </When>
        <Otherwise>
          <form onSubmit={this.onSubmit.bind(this)}>
            <input type="text" placeholder="Email Address" ref={node => this.emailTextbox = node}/>
            <input type="password" placeholder="Password" ref={node => this.passwordTextbox = node}/>
            <input type="submit" value="Login"/>
            <Link to="users/register">Sign Up</Link>
          </form>
        </Otherwise>
      </Choose>
    );
  }
}

export default Relay.createContainer(HeaderMenu, {
  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        currentUser {
          ${LoggedInStatus.getFragment('user')}
        }
        ${UpdateCurrentUserMutation.getFragment('viewer')}
      }
    `
  },
});