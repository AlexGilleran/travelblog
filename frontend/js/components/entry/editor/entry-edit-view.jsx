import React from 'react';
import Relay from 'react-relay';

class EntryEditView extends React.Component {
  onSubmit(event) {
    event.preventDefault();
  }

  getEntryDetails() {
    return {
      entryId: parseInt(this.props.params.entryId),
      blogId: this.props.entry.blogId,
      title: this.refs.title.getDOMNode().value,
      markdown: this.refs.markdown.getDOMNode().value
    };
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className="col-1-1">
          <input type="text" ref="title" defaultValue={this.props.viewer.entry.title}/>
        </div>

        <div className="col-1-1">

        </div>

        <div className="col-1-1">
          <input type="submit" value="Save"/>
        </div>
      </form>
    );
  }
}

export default Relay.createContainer(EntryEditView, {
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
          title
        }
      }
    `
  }
});