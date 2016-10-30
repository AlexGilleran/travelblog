import React from 'react';
import Relay from 'react-relay';
import EditUserView from './edit-user-view';
import UpdateCurrentUserMutation from '../../mutations/refresh-current-user-mutation';
import {withRouter} from 'react-router';

class RegisterView extends React.Component {
  componentWillMount() {
    this.redirectIfLoggedIn(this.props);
  }

  componentWillReceiveProps(props) {
    this.redirectIfLoggedIn(props);
  }

  redirectIfLoggedIn(props) {
    if (props.viewer.currentUser) {
      props.router.push(`/users/${props.viewer.currentUser.userId}`)
    }
  }

  onSubmit(event) {
    event.preventDefault();

    const userDetails = this.editUserView.getUserDetails();

    fetch('/api/users/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
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
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <EditUserView userDetails={this.props.userDetails} ref={(ref => this.editUserView = ref).bind(this)}/>
          <input type="submit" value="Register"/>
        </form>
      </div>
    );
  }
}

export default Relay.createContainer(withRouter(RegisterView), {
  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        currentUser {
          userId
        }
        ${UpdateCurrentUserMutation.getFragment('viewer')}
      }
    `
  }
});