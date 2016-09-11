import React from 'react';
import Relay from 'react-relay';
import BlogListView from './blog/blog-list-view';

export default class HomeView extends React.Component {
  render() {
    return (
      <div>
        <div className="col-2-3">
          Home
        </div>
        <div className="col-1-3">
          <BlogListView />
        </div>
      </div>
    );
  }
};