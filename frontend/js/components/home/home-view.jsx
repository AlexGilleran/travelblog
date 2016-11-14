import React from 'react';
import Relay from 'react-relay';
import LoggedIn from './logged-in';
import LoggedOut from './logged-out';

class RootHomeView extends React.Component {
  render() {
    const viewer = this.props.viewer;
    const loggedIn = !!viewer.currentUser;

    return (
      <Choose>
        <When condition={loggedIn}>
          <LoggedIn viewer={viewer}/>
        </When>
        <Otherwise>
          <LoggedOut viewer={viewer}/>
        </Otherwise>
      </Choose>
    );
  }
}

export default Relay.createContainer(RootHomeView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        currentUser {
          userId
        }
        ${LoggedIn.getFragment('viewer')}
        ${LoggedOut.getFragment('viewer')}
      }
    `
  }
});