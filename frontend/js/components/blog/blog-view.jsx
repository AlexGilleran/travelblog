import React from 'react';
import Relay from 'react-relay';
import BlogListView from './blog-list-view';
import EntryPreviewView from '../entry/entry-preview-view';
import {Link} from 'react-router';

class BlogView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const blog = this.props.viewer.blog;
    const currentUser = this.props.viewer.currentUser;

    return (
      <div>
        <div className="col-2-3">
          <If condition={blog}>
            <div>
              <div>
                <h2>{blog.name} by <Link to={`/users/${blog.user.userId}`}>{blog.user.displayName}</Link></h2>
              </div>
              <For each="entry" of={blog.entries.edges}>
                <EntryPreviewView key={entry.node.entryId} entry={entry.node}/>
              </For>
              <If condition={currentUser && currentUser.userId === blog.user.userId}>
                <Link to={`/blogs/${blog.blogId}/entries/add`}>Add Blog</Link>
              </If>
            </div>
          </If>
        </div>
        <div className="col-1-3">
          <BlogListView blogList={this.props.viewer.blogs} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(BlogView, {
  initialVariables: {
    blogId: null
  },

  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        currentUser {
          userId
        }
        blogs(first: 3) {
          ${BlogListView.getFragment('blogList')}
        },
        blog(blogId: $blogId) {
          blogId,
          name,
          user {
            userId,
            displayName
          },
          entries(first: 5) {
            edges {
              node {
                entryId
                ${EntryPreviewView.getFragment('entry')}   
              }
            }
          }
        }
      }
    `
  },
});