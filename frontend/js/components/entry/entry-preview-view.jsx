import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import Viewer from './view/viewer';

class EntryPreviewView extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h3>
            <Link to={`/blogs/${this.props.entry.blogId}/entries/${this.props.entry.entryId}`}>{this.props.entry.title}</Link>
          </h3>
        </div>
        <If condition={this.props.entry.markdown}>
          <Viewer rawContentState={this.props.entry.markdown}/>
        </If>
      </div>
    );
  }
}

export default Relay.createContainer(EntryPreviewView, {
  fragments: {
    entry: () => Relay.QL`
      fragment on Entry {
        blogId
        entryId
        title
        markdown
      }
    `
  },
});