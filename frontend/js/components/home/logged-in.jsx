import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import LatestBlog from './latest-blog';
import mapPicture from './map.jpg';
import styled from 'styled-components';

const LeftCol = styled.div`
  width: 66%;
`;

class LoggedInHomeView extends React.Component {
  render() {
    const currentUser = this.props.viewer.currentUser;
    const latestBlog = currentUser.blogs.edges.length && currentUser.blogs.edges[0].node;

    return (
      <div>
        <LeftCol>
          <div>
            Welcome back {currentUser.displayName}!
          </div>
          <If condition={latestBlog}>
            <LatestBlog latestBlog={latestBlog}/>
          </If>
          <h2>Your updates...</h2>
        </LeftCol>
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
                ${LatestBlog.getFragment('latestBlog')}
              }
            }
          }
        }
      }
    `
  }
});