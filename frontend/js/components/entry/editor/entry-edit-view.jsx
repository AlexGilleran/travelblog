import React from 'react';
import Relay from 'react-relay';
import UpdateEntryMutation from '../../../mutations/update-entry-mutation';

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
      markdown: this.markdownElement.value
    };
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="col-1-1">
          <input type="text" ref={node => this.titleElement = node} defaultValue={this.props.entry.title}/>
        </div>

        <div className="col-1-1">
          <textarea ref={node => this.markdownElement = node}>
            {this.props.entry.markdown}
          </textarea>
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