import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import LatestBlog from './latest-blog';
import mapPicture from './map.jpg';
import styled from 'styled-components';

const LeftCol = styled.div`
  // width: 66%;
`;

class LoggedInHomeView extends React.Component {
  render() {
    const currentUser = this.props.viewer.currentUser;
    const latestBlog = currentUser.blogs.edges.length && currentUser.blogs.edges[0].node;

    return (
      <div>
        <LeftCol>
          <If condition={latestBlog}>
            <h2>Your latest adventure...</h2>
            <LatestBlog latestBlog={latestBlog}/>
          </If>
          <h2>Your updates...</h2>
          <ul>
            <li>Blah {'<'}3'd your post!</li>
            <li>25 new views for "x"</li>
            <li>123 posted a new update:</li>
          </ul>
          
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