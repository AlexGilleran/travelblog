import React from 'react';
import Relay from 'react-relay';
import DetailsView from './details-view';
import EntryPreviewView from '../entry/entry-preview-view.jsx';
import BlogPreviewView from '../blog/blog-preview-view';

class UserView extends React.Component {
  render() {
    return (
      <div className="col-3-3">
        <If condition={this.props.viewer.user}>
          <div>
            <h1>Details</h1>
            <DetailsView details={this.props.viewer.user}/>

            {/*<h1>Recent Activity</h1>
            <For each="activity" of={this.props.user.activity}>
              <EntryPreviewView entry={activity} key={activity.entryId} />
            </For>*/}

            <h1>Blogs</h1>
            <For each="blog" of={this.props.viewer.user.blogs.edges}>
              <BlogPreviewView blog={blog.node} key={blog.node.blogId} />
            </For>
          </div>
        </If>
      </div>
    );
  }
}


export default Relay.createContainer(UserView, {
  initialVariables: {
    userId: null
  },

  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        user(userId: $userId) {
          ${DetailsView.getFragment('details')}
          blogs: blogs(first: 5) {
            edges {
              node {
                blogId
                ${BlogPreviewView.getFragment('blog')}
              }
            }
          }
        }
      }
    `
  }
});