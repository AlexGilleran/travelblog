import React from 'react';
import Relay from 'react-relay';
import HeaderView from './header/header';
import styled from 'styled-components';
import {mediaQuery, contentWidth} from '../styles/responsive';
import variables from '../styles/variables';
import {combine} from '../styles/util';

const Content = styled.div`  
  ${mediaQuery(variables.breakpoints.handheld, variables.breakpoints.tablet)`
    padding-top: ${variables.headerHeight};
  `};
  
  ${mediaQuery(variables.breakpoints.laptop, variables.breakpoints.desktop)`
    margin-top: 10px;
  `};
  
  ${contentWidth}
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