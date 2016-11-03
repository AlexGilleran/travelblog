import React from 'react';
import Relay from 'react-relay';
import UpdateEntryMutation from '../../../mutations/update-entry-mutation';
import Editor from './editor';

class EntryEditView extends React.Component {
  onSubmit(event) {
    event.preventDefault();

    this.props.relay.commitUpdate(
      new UpdateEntryMutation({entry: this.props.entry, ...this.getEntryDetails()})
    );
  }

  getEntryDetails() {
    return {
      title: this.titleElement.value,
      markdown: JSON.stringify(this.editor.getContentState())
    };
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="col-1-1">
          <input type="text" ref={node => this.titleElement = node} defaultValue={this.props.entry.title}/>
        </div>

        <div className="col-1-1">
          <Editor
            contentState={this.props.entry.markdown && JSON.parse(this.props.entry.markdown)}
            ref={editor => this.editor = editor}/>
        </div>

        <div className="col-1-1">
          <input type="submit" value="Save"/>
        </div>
      </form>
    );
  }
}

export default Relay.createContainer(EntryEditView, {
  fragments: {
    entry: (variables) => Relay.QL`
      fragment on Entry { 
        entryId,
        title,
        markdown
        ${UpdateEntryMutation.getFragment('entry')}
      }
    `
  }
});