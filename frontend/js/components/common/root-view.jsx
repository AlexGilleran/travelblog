import React from 'react';
import HeaderView from './header-view';

export default class RootView extends React.Component {
  render() {
    console.log(this.props.children);
    return (
      <div>
        <HeaderView/>
        {this.props.children}
      </div>
    );
  }
}