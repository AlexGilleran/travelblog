var React = require('react');
var EntryStoreModule = require('../../stores/entry-store');
var {Link} =  require('react-router');
import FluxComponent from 'flummox/component';
var Remarkable = require('remarkable');
import {serialiseSelection, restoreSelection} from '../../util/save-selection';
import find from 'lodash/collection/find';

const markdownRegex = new RegExp('\\*|\\||#|\\/|\\(|\\)|\\[|\\]|<|>|\\_');
const substitutionMappings = {
  " ": ['&nbsp;', String.fromCharCode(160)],
}
substitutionMappings[String.fromCharCode(160)] = [" ", '&nbsp;'];

const md = new Remarkable();

// FIXME: This is the naivest diff algorithm ever and I'm sure it will break.
function getMarkdownIndex(text, markdown) {
  var textIndex = 0, markdownIndex = 0;

  while (textIndex < text.length) {
    if (markdownIndex >= markdown.length) {
      throw new Error('Broke in diff');
    }

    const lengthToAdvance = getAdvanceLength(text.substring(textIndex, textIndex + 1), markdown, markdownIndex);
    if (lengthToAdvance) {
      textIndex++;
      markdownIndex += lengthToAdvance;
    } else {
      markdownIndex++;
    }
  }

  return markdownIndex;
}

function getAdvanceLength(textChar, markdown, markdownIndex) {
  if (textChar === markdown.substring(markdownIndex, markdownIndex + 1)) {
    return 1;
  }

  if (!substitutionMappings[textChar]) {
    return 0;
  }

  const correctSubstitution = find(substitutionMappings[textChar], substitution =>
    substitution === markdown.substring(markdownIndex, markdownIndex + substitution.length)
  );

  return correctSubstitution ? correctSubstitution.length : 0;
}

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
    const char = String.fromCharCode(event.charCode);

    // TODO: function
    var toInsert = markdownRegex.test(char) ? '\\' + char : char;
    if (toInsert === ' ') {
      toInsert = '&nbsp;';
    }

    const splitIndex = getMarkdownIndex(savedSelection.containerText, this.state.markdown);

    savedSelection.start += 1;
    savedSelection.end += 1;

    this.setState({
      selection: savedSelection,
      markdown: this.state.markdown.substring(0, splitIndex) +
        toInsert + this.state.markdown.substring(splitIndex)
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