var React = require('react');
var EntryStoreModule = require('../../stores/entry-store');
var {Link} =  require('react-router');
import FluxComponent from 'flummox/component';
import BlogEditor from './editor/blog-editor';
var Remarkable = require('remarkable');
var md = new Remarkable();

export default class EntryEditView extends React.Component {
  onSubmit(event) {
    event.preventDefault();

    this.props.flux.getActions('entry').updateEntry(this.getEntryDetails());
  }

  getEntryDetails() {
    return {
      entryId: parseInt(this.props.params.entryId),
      blogId: this.props.entry.blogId,
      title: this.refs.title.getDOMNode().value,
      markdown: this.refs.markdown.getDOMNode().value
    };
  }

  onKeypress() {

  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="col-1-1">
          <input type="text" ref="title" defaultValue={this.props.entry.title}/>
        </div>

        <div className="col-1-1">
          <BlogEditor markdown={this.props.entry.markdown} />
        </div>

        <div className="col-1-1">
          <input type="submit" value="Save"/>
        </div>
      </form>
    );
  }
}