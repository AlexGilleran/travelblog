const React = require('react');
const EntryParagraphView = require('../view/entry-paragraph-view');
const indexBy = require('lodash/collection/indexBy');
const {serialiseSelection} = require('./save-selection');
const parse = require('../view/parse-md-to-react');

const INLINE_FORMATTERS = require('../inline-formatters');
const INLINE_FORMATTERS_LOOKUP = indexBy(INLINE_FORMATTERS, formatter => formatter.symbol);

module.exports = React.createClass({

  getContents: function () {
    return parse(INLINE_FORMATTERS, this.props.element.text)[0];
  },

  del: function(forward) {
    const selection = serialiseSelection(this.refs.editable.getDOMNode());

  },

  onInput: function(e) {
    //e.preventDefault();
  },

  render: function () {
    return (
      <span ref="editable">
        {this.getContents()}
      </span>
    );
  }
});

//const deleteFromMd = function () {
//  const ESCAPED_FORMATTERS_LOOKUP = indexBy(INLINE_FORMATTERS, formatter => '\\' + formatter.symbol);
//
//  return function (md, start, end) {
//    const twoCharDeletionIndex = index + (delta * 2);
//    const nextTwoChars = md.substring(index, twoCharDeletionIndex);
//
//    if (ESCAPED_FORMATTERS_LOOKUP[nextTwoChars]) {
//      return twoCharDeletionIndex;
//    }
//  };
//}();
//