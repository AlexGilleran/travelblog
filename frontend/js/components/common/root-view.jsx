import React from 'react';
import Relay from 'react-relay';
import HeaderView from './header/header';
import Content from './content';

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