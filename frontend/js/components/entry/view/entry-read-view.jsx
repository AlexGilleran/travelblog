import React from 'react';
import Relay from 'react-relay';
import Viewer from './viewer';
import { Link } from 'react-router';

class EntryReadView extends React.Component {
  render() {
    const entry = this.props.viewer.entry;
    const blog = this.props.viewer.blog;
    const currentUser = this.props.viewer.currentUser;

    return (
      <div>
        <h2 className="col-1-1">
          {entry.title}
        </h2>
        <If condition={currentUser && currentUser.userId === blog.userId}>
          <Link to={`/blogs/${blog.blogId}/entries/${entry.entryId}/edit`}>Edit this entry</Link>
        </If>
        <div className="col-1-1">
          <Viewer 
            rawContentState={entry.markdown} />
        </div>
        <div className="col-1-1">
          <Link to={`/blogs/${blog.blogId}`}>Back to {blog.name}</Link>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(EntryReadView, {
  initialVariables: {
    entryId: null,
    blogId: null
  },
  
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {,
        blog(blogId: $blogId) {
          blogId,
          name,
          userId
        },
        currentUser {
          userId
        }
        entry(entryId: $entryId) {
          entryId,
          title,
          markdown
        }
      }
    `
  }
});