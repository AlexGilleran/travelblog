import React from 'react';
import Relay from 'react-relay';
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
              {blog.node.blogId}
              {/*<BlogPreviewView blog={blog} key={blog.blogId} />*/}
            </For>
          </div>
        </If>
      </div>
    );
  }
}

class DetailsView extends React.Component {
  render() {
    const details = this.props.details;

    return (
      <div>
        <div><strong>{details.userName}</strong></div>
        <div>Name: {details.displayName}</div>
        <div>Avatar: <img src={details.avatarUrl}/></div>
        <div>Bio: {details.bio}</div>
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
          userId,
          userName,
          blogs: blogs(first: 2) {
            edges {
              node {
                blogId
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      }
    `
  }
});