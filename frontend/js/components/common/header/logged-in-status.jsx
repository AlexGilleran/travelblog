import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 5px;
`;

function LoggedInStatus(props) {
  const user = props.user;
  return (
    <Root>
      <Avatar src={user.avatarUrl} />
      <Link to={`/users/${user.userId}`}>{user.userName}</Link>
    </Root>
  );
}

export default Relay.createContainer(LoggedInStatus, {
  fragments: {
    user: (variables) => Relay.QL`
      fragment on User {
        userId
        userName
        avatarUrl
      }
    `
  }
});