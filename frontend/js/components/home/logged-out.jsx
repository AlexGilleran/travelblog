import React from 'react';
import Relay from 'react-relay';
import BlogListView from '../blog/blog-list-view';

class LoggedOutHomeView extends React.Component {
  render() {
    return (
      <div>
        <div className="col-2-3">
          Home
        </div>
        <div className="col-1-3">
          <BlogListView blogList={this.props.viewer.blogs} />
        </div>
      </div>
    );
  }
};
export default Relay.createContainer(LoggedOutHomeView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        blogs(first: 10) {
          ${BlogListView.getFragment('blogList')}
        }
      }
    `
  }
});