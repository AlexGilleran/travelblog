import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import logo from '../logo.png';
import styled from 'styled-components';
import {mediaQuery, contentWidth} from '../../styles/responsive';
import variables from '../../styles/variables';
import {combine} from '../../styles/util';
import HeaderDock from './dock';


const Background = styled.div`
  width: 100%;
  background: #AAA;
  height: ${variables.headerHeight};
  
  ${mediaQuery(variables.breakpoints.handheld, variables.breakpoints.tablet)`
    position: fixed;
  `}
`;

const Root = styled.header`
  height: ${variables.headerHeight};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${contentWidth}
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
      <Background>
        <Root>
          <Left>
            <Link to="/">
              <Logo src={logo}/>
            </Link>
            <TextLink to="/">AlexBlog</TextLink>
          </Left>
          <div>
            <HeaderDock viewer={this.props.viewer}/>
          </div>
        </Root>
      </Background>
    );
  }
}

export default Relay.createContainer(HeaderView, {
  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        ${HeaderDock.getFragment('viewer')}
      }
    `
  },
});