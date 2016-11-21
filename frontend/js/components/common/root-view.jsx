import React from 'react';
import Relay from 'react-relay';
import HeaderView from './header/header-view';
import styled from 'styled-components';
import {mediaQuery, contentWidth} from '../styles/responsive';
import variables from '../styles/variables';
import {combine} from '../styles/util';

const Content = styled.div`  
  ${mediaQuery(variables.breakpoints.handheld, variables.breakpoints.tablet)`
    padding-top: ${variables.headerHeight};
    margin: 0 auto;
  `};
  
  ${mediaQuery(variables.breakpoints.laptop, variables.breakpoints.desktop)`
    margin: 10px auto 0 auto
  `};
  
  ${mediaQuery(variables.breakpoints.handheld)`
    width: ${variables.breakpoints.handheld.contentWidth};
    padding-left: 10px;
    padding-right: 10px;
  `}
  
  ${mediaQuery(variables.breakpoints.tablet)`
    max-width: ${variables.breakpoints.tablet.contentWidth};
  `}
  
  ${mediaQuery(variables.breakpoints.laptop)`
    max-width: ${variables.breakpoints.laptop.contentWidth};
  `}
  
  ${mediaQuery(variables.breakpoints.desktop)`
    max-width: ${variables.breakpoints.desktop.contentWidth};
  `}
`;

class RootView extends React.Component {
  render() {
    return (
      <div>
        <HeaderView viewer={this.props.viewer}/>
        <Content>
          {this.props.children}
        </Content>
      </div>
    );
  }
}

export default Relay.createContainer(RootView, {
  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        ${HeaderView.getFragment('viewer')}
      }
    `
  },
});