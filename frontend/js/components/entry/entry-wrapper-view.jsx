import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import EntryEditView from './editor/entry-edit-view';
import EntryReadView from './view/entry-read-view';

class EntryView extends React.Component {
  render() {
    return (
      <div>
        <If condition={this.props.viewer.entry}>
          <div>
            {React.Children.map(this.props.children, child => React.cloneElement(child, {entry: this.props.viewer.entry}))}

            <div className="col-1-1">
              <Link to={`/blogs/${this.props.viewer.entry.blogId}`}>Back to Blog</Link>
            </div>
          </div>
          <Else />

          <div>No entry data</div>
        </If>
      </div>
    );
  }
}

const COMPONENTS = [EntryReadView];

export default Relay.createContainer(EntryView, {
  initialVariables: {
    entryId: null
  },

  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        entry(entryId: $entryId) { 
          blogId,
          ${COMPONENTS.map((Component) => {
            return Component.getFragment('entry');
          })}
        }
      }
    `
  }
});