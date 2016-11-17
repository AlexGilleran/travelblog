import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import mapPicture from './map.jpg';
import styled from 'styled-components';

const Root = styled.div`
  border: 1px black solid;
`;

const BlogRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WithMargin = `
  margin: 5px;
`;

const Map = styled.img`
  height: 50px;
  width: 100px;
  ${WithMargin}
`;

const BlogTitle = styled.h3`
  ${WithMargin}
  display: inline-block;
`;

const LastUpdate = styled.p`
  ${WithMargin}
`;

const NewPostButton = styled.button`
`;

const BlogRowLeft = styled.div`
  display: flex;
  align-items: center;
`;

function LatestBlog(props) {
  const latestBlog = props.latestBlog;

  return (
    <Root className={props.className}>
      <div>
        <h4>Your latest adventure...</h4>
      </div>
      <BlogRow>
        <BlogRowLeft>
          <Map src={mapPicture}/>
          <Link to={`/blogs/${latestBlog.blogId}`}>
            <BlogTitle>{latestBlog.name}</BlogTitle>
          </Link>
          <LastUpdate>
            Last update: x
          </LastUpdate>
        </BlogRowLeft>
        <NewPostButton>New Post</NewPostButton>
      </BlogRow>
    </Root>
  );
}

export default Relay.createContainer(LatestBlog, {
  fragments: {
    latestBlog: () => Relay.QL`
      fragment on Blog {
        blogId
        name
      }
    `
  }
});