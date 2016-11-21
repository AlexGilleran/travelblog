import React from 'react';
import Relay from 'react-relay';
import HeaderView from './header/header-view';
import styled from 'styled-components';
import responsive from '../styles/responsive';

const Content = styled.div`
  max-width: 786px;
  margin: 10px auto 0 auto;
  
  ${responsive.handheld`
    // width: 100%;
    margin: 0 10px;
    padding-top: 10px;
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