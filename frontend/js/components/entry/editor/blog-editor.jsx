var React = require('react');
var EntryStoreModule = require('../../../stores/entry-store');
var {Link} =  require('react-router');
import FluxComponent from 'flummox/component';
var Remarkable = require('remarkable');
import {serialiseSelection, restoreSelection} from './save-selection';
import mapMarkdownIndex from './map-markdown-index';
import sanitiseForMarkdown from './sanitise-for-markdown';

const md = new Remarkable();

export default class BlogEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      markdown: props.markdown
    };
  }

  getBlogHtml() {
    return {
      __html: md.render(this.state.markdown)
    }
  }

  onKeyPress(event) {
    const savedSelection = serialiseSelection(this.refs.markdown.getDOMNode());
    const char = sanitiseForMarkdown(String.fromCharCode(event.charCode));
    const splitIndex = mapMarkdownIndex(savedSelection.containerText, this.state.markdown);

    savedSelection.start += 1;
    savedSelection.end += 1;

    this.setState({
      selection: savedSelection,
      markdown: this.state.markdown.substring(0, splitIndex) +
        char + this.state.markdown.substring(splitIndex)
    });

    event.preventDefault();
  }

  componentDidUpdate() {
    restoreSelection(this.refs.markdown.getDOMNode(), this.state.selection);
  }

  render() {
    return (
      <div
        contentEditable="true"
        ref="markdown"
        dangerouslySetInnerHTML={this.getBlogHtml()}
        onKeyPress={this.onKeyPress.bind(this)}
        />
    );
  }
}