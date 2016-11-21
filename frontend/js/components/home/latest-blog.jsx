import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import mapPicture from './map.jpg';
import styled from 'styled-components';
import variables from '../styles/variables';
import {mediaQuery} from '../styles/responsive';

const Root = styled.div`
  
`;

const Cols = styled.div`
  display: flex;
  justify-content: space-around;
    
  ${mediaQuery(variables.breakpoints.handheld, variables.breakpoints.tablet)`
    flex-direction: column;
  `}
`;

const BlogCol = styled.div`
  width: 50%;
  
  ${mediaQuery(variables.breakpoints.handheld, variables.breakpoints.tablet)`
    width: 100%;
    order: 1;
  `}
`;

const MapCol = styled.div`
  width: 40%;
  
  ${mediaQuery(variables.breakpoints.handheld, variables.breakpoints.tablet)`
    width: 100%;
    order: 0;
  `}
`;

const WithMargin = `
  margin: 5px;
`;

const Map = styled.img`
  
  height: 150px;
  width: 100%;
  
`;

const BlogTitle = styled.h2`
  ${WithMargin}
  display: inline-block;
`;

const LastUpdate = styled.p`
  ${WithMargin}
`;

const PostBox = styled.textarea`
  text-align: center;
  padding: 15px 10px 10px 10px;
  height: 55px;
  display: block;
  width: 100%;
  font-size: 20px;
`;

function LatestBlog(props) {
  const latestBlog = props.latestBlog;

  return (
    <Root className={props.className}>
      <Cols>
        <BlogCol>
          <Link to={`/blogs/${latestBlog.blogId}`}>
            <BlogTitle>{latestBlog.name}</BlogTitle>
          </Link>
          <LastUpdate>
            Last update: 2/2/2016 in Istanbul Turkey
          </LastUpdate>
          <PostBox placeholder="Write an update"/>
        </BlogCol>
        <MapCol>
          <Map src={mapPicture}/>
        </MapCol>
      </Cols>
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