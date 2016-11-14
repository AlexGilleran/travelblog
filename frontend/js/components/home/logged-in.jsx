import React from 'react';
import Relay from 'react-relay';
import mapPicture from './map.jpg';


class LoggedInHomeView extends React.Component {
  render() {
    const currentUser = this.props.viewer.currentUser;

    return (
      <div>
        Welcome back {currentUser.displayName}!
        <article>
          <h2>Your current adventure...</h2>
          <h3>{currentUser.blogs.edges[0].node.name}</h3>
          <img src={mapPicture} />
        </article>
      </div>
    );
  }
}

export default Relay.createContainer(LoggedInHomeView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        currentUser {
          displayName
          blogs(first: 1) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    `
  }
});