import React from 'react';
import Relay from 'react-relay';
import LoginView from './login-view';
import {Link} from 'react-router';
import logo from '../logo.png';
import styled from 'styled-components';
import responsive from '../../styles/responsive';

const Root = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #AAA;
  
  ${responsive.handheld`
    position: fixed;
  `}
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 30px;
  width: 30px;
`;

const TextLink = styled(Link)`
  color: #000;
`;

class HeaderView extends React.Component {
  render() {
    return (
      <Root>
        <Left>
          <Link to="/">
            <Logo src={logo}/>
          </Link>
          <TextLink to="/">AlexBlog</TextLink>
        </Left>
        <div>
          <LoginView viewer={this.props.viewer}/>
        </div>
      </Root>
    );
  }
}

export default Relay.createContainer(HeaderView, {
  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        ${LoginView.getFragment('viewer')}
      }
    `
  },
});