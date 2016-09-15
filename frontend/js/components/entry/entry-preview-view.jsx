import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

class EntryPreviewView extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h3>
            <Link to="viewEntry" params={this.props.entry}>{this.props.entry.title}</Link>
          </h3>
        </div>
        <div>{this.props.entry.markdown}</div>
      </div>
    );
  }
}

export default Relay.createContainer(EntryPreviewView, {
  fragments: {
    entry: () => Relay.QL`
      fragment on Entry {
        entryId
        title
        markdown
      }
    `
  },
});