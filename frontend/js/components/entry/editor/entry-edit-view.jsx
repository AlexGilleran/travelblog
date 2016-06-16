const React = require('react');
const EntryContentEditView = require('./entry-content-edit-view');

module.exports = React.createClass({
  onSubmit: function(event) {
    event.preventDefault();

    this.props.flux.getActions('entry').updateEntry(this.getEntryDetails());
  },

  getEntryDetails: function() {
    return {
      entryId: parseInt(this.props.params.entryId),
      blogId: this.props.entry.blogId,
      title: this.refs.title.getDOMNode().value,
      markdown: this.refs.markdown.getDOMNode().value
    };
  },

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className="col-1-1">
          <input type="text" ref="title" defaultValue={this.props.entry.title}/>
        </div>

        <div className="col-1-1">
          <EntryContentEditView content={this.props.entry.content} />
        </div>

        <div className="col-1-1">
          <input type="submit" value="Save"/>
        </div>
      </form>
    );
  }
});