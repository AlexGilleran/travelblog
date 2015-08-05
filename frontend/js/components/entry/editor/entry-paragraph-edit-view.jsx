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

  onInput: function (e) {
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

//function buildFullLookup(text, indexMap) {
//  return reduce(indexMap, (acc, indexes, name) => {
//    acc[name] = constructLookup(indexes, text.length);
//    return acc;
//  }, {});
//}

//function constructLookup(flipLocations, length) {
//  let applied = false;
//  let currentFlipIndex = 0;
//  const lookup = [];
//
//  for (let i = 0; i < length; i++) {
//    if (i === flipLocations[currentFlipIndex]) {
//      applied = !applied;
//    }
//
//    lookup[i] = applied;
//  }
//
//  return lookup;
//}

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

//function parse2(fragment, formatters, applyFormatting = false) {
//  if (!formatters.length) {
//    return [fragment, false];
//  }
//
//  const formatter = formatters[0];
//  //const restOfFormatters = formatters.slice(1);
//
//  const indexes = [0].concat(fragment.formatting[formatter.name]).concat([fragment.text.length - 1]);
//  const list = [];
//
//  for (let i = 1; i < indexes.length; i++) {
//    const startIndex = indexes[i - 1];
//    const endIndex = indexes[i];
//    const text = fragment.text.substring(startIndex, endIndex);
//
//
//    list.push(applyFormatting ? formatter(text) : text);
//    applyFormatting = !applyFormatting;
//  }
//};