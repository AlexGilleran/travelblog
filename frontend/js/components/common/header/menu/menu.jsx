import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import MenuInner from './inner';

import styled from 'styled-components';

const avatarSize = '40px';

const Root = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Button = styled.button`
  border: none;
`;

const Avatar = styled(Button)`
  background: url(${props => props.src});
  height: 40px;
  width: 40px;
  background-size: ${avatarSize} ${avatarSize};
`;

class LoggedInStatus extends React.Component {
  state = {
    showMenu: false
  };

  onAvatarClick() {
    this.setState({
      showMenu: !this.state.showMenu
    });
  }

  render() {
    const user = this.props.user;
    return (
      <Root>
        <Avatar src={user.avatarUrl} onClick={this.onAvatarClick.bind(this)} />
        <If condition={this.state.showMenu}>
          <MenuInner offsetTop={avatarSize} />
        </If>
      </Root>
    );
  }
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