const React = require('react');
const EntryParagraphView = require('../view/entry-paragraph-view');
const indexBy = require('lodash/collection/indexBy');
const {serialiseSelection} = require('./save-selection');
const parse = require('../view/parse-md-to-react');

const INLINE_FORMATTERS = require('../inline-formatters');
const INLINE_FORMATTERS_LOOKUP = indexBy(INLINE_FORMATTERS, formatter => formatter.symbol);

module.exports = React.createClass({
  onKeyPress: function(event) {
    const char = String.fromCharCode(event.charCode);
    const selection = serialiseSelection(this.refs.editable.getDOMNode());

    const text = this.props.element.text;
    const index = selection.start + calcOffset(text, selection.start);
    this.props.element.text = text.substring(0, index) + char + text.substring(index);

    selection.start += 1;
    selection.end += 1;

    this.props.onChange(this.refs.editable.getDOMNode(), selection, this.props.element);

    event.preventDefault();
  },

  onKeyDown: function(event) {
    if (event.keyCode === 8) {
      const selection = serialiseSelection(this.refs.editable.getDOMNode());

      const text = this.props.element.text;
      const index = selection.start + calcOffset(text, selection.start);
      this.props.element.text = text.substring(0, index - 1) + text.substring(index);

      selection.start--;
      selection.end--;

      this.props.onChange(this.refs.editable.getDOMNode(), selection, this.props.element);

      event.preventDefault();
    }
  },

  getContents: function() {
    return parse(INLINE_FORMATTERS, this.props.element.text)[0];
  },

  render: function() {
    return (
      <span ref="editable" contentEditable="true" onKeyPress={this.onKeyPress} onKeyDown={this.onKeyDown}>
        {this.getContents()}
      </span>
    );
  }
});

function calcOffset(md, index) {
  let mdCharCount = 0;
  let nonMdCharCount = 0;
  let i = 0;

  while (nonMdCharCount < index) {
    const char = md.charAt(i);
    const hasFormatter = !!INLINE_FORMATTERS_LOOKUP[char];

    if (hasFormatter) {
      mdCharCount++;
    } else {
      nonMdCharCount++;
    }

    i++;
  }

  // Make sure we don't stop between an escaped md char and the escaping slash
  const secondLastChar = i > 0 ? md.charAt(i - 1) : null;
  if (INLINE_FORMATTERS_LOOKUP[md.charAt(i)] && secondLastChar === '\\') {
    mdCharCount++;
  }

  return mdCharCount;
}