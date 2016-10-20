import React from 'react';
import Relay from 'react-relay';
import HeaderView from './header-view';


class RootView extends React.Component {
  render() {
    return (
      <div>
        <HeaderView viewer={this.props.viewer}/>
        {this.props.children}
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