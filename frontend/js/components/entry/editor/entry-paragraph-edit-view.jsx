const React = require('react');
const EntryParagraphView = require('../view/entry-paragraph-view');
const reduce = require('lodash/collection/reduce');
const map = require('lodash/collection/map');
const {serialiseSelection} = require('./save-selection');
//const parse = require('../view/parse-md-to-react');


const INLINE_FORMATTERS = {
  italic: toWrap => (<em>{toWrap}</em>),
  bold: toWrap => (<strong>{toWrap}</strong>)
};
const INLINE_FORMATTERS_LIST = map(INLINE_FORMATTERS, (formatter, name) => ({name: name, formatter: formatter}));

module.exports = React.createClass({

  getContents: function () {
    const fragment = this.props.element;
    const combinedIndexes = combineIndexes(fragment.text, fragment.formatting);

    return renderText(fragment.text, combinedIndexes);
  },

  render: function () {
    return (
      <span ref="editable">
        {this.getContents()}
      </span>
    );
  }
});

function combineIndexes(text, formatterToIndexesMap) {
  const byIndex = reduce(formatterToIndexesMap, (acc, indexes, formatterName) => {
    for (let index of indexes) {
      acc[index] = acc[index] || [];
      acc[index].push(formatterName);
    }

    return acc;
  }, {});

  return map(byIndex, (value, key) => ({index: key, formatterNames: value}));
}

function renderText(text, combinedIndexes) {
  const applying = {};
  const result = [];
  combinedIndexes = [{index: 0, formatterNames: []}].concat(combinedIndexes).concat([{
    index: text.length,
    formatterNames: []
  }]);

  for (let i = 1; i < combinedIndexes.length; i++) {
    let substring = text.substring(combinedIndexes[i - 1].index, combinedIndexes[i].index);
    let innerResult = substring;

    for (let formatter of INLINE_FORMATTERS_LIST) {
      if (applying[formatter.name]) {
        innerResult = formatter.formatter(innerResult);
      }
    }

    result.push(innerResult);

    for (let formatterName of combinedIndexes[i].formatterNames) {
      applying[formatterName] = !applying[formatterName];
    }
  }

  return result;
}