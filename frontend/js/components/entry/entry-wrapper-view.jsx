import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import EntryEditView from './editor/entry-edit-view';
import EntryReadView from './view/entry-read-view';

class EntryView extends React.Component {
  render() {
    const entry = this.props.viewer.entry;
    const blog = this.props.viewer.entry.blog;
    const currentUser = this.props.viewer.currentUser;

    return (
      <div>
        <If condition={this.props.viewer.entry}>
          <If condition={currentUser && currentUser.userId === blog.userId}>
            <Link to={`/entries/${this.props.params.entryId}/edit`}>Edit this entry</Link>
          </If>
          <div>
            {React.Children.map(this.props.children, (child, i) => React.cloneElement(child, {key: i, entry: this.props.viewer.entry}))}

            <div className="col-1-1">
              <Link to={`/blogs/${blog.blogId}`}>Back to {blog.name}</Link>
            </div>
          </div>
          <Else />

          <div>No entry data</div>
        </If>
      </div>
    );
  }
}

const COMPONENTS = [EntryReadView, EntryEditView];

export default Relay.createContainer(EntryView, {
  initialVariables: {
    entryId: null
  },

  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        currentUser {
          userId
        },
        entry(entryId: $entryId) { 
          blog {
            blogId,
            name,
            userId
          }
          ${COMPONENTS.map((Component) => {
            return Component.getFragment('entry');
          })}
        }
      }
    `
  }
});