const React = require('react');
const EntryStoreModule = require('../../../stores/entry-store');
const {Link} =  require('react-router');
const FluxComponent = require('flummox/component');
const clone = require('lodash/lang/clone');
const EntryElementWrapper = require('../entry-element-wrapper');
const EntryImageView = require('../view/entry-image-view');
const EntryParagraphEditView = require('./entry-paragraph-edit-view');
const {serialiseSelection, restoreSelection} = require('./save-selection');
const assign = require('lodash/object/assign');

const TYPE_TO_COMPONENT_MAP = {
  para: EntryParagraphEditView,
  image: EntryImageView
};

module.exports = React.createClass({
  getInitialState() {
    return {
      content: this.props.content
    }
  },

  componentDidUpdate: function () {
    if (this.state.selection) {
      restoreSelection(this.refs['fragment-' + this.state.selection.fragmentIndex].getDOMNode(), this.state.selection.textIndexes);
      this.setState({selection: undefined});
    }
  },

  onInput: function () {
    // if the user actually manages to edit the document in some way we haven't caught, immediately revert it.
    this.forceUpdate();
  },

  onKeyPress: function (event) {
    const char = String.fromCharCode(event.charCode);
    const selection = serialiseSelection(this.refs.editable.getDOMNode());

    const text = this.props.element.text;
    const index = selection.start + calcOffset(text, selection.start);
    this.props.element.text = text.substring(0, index) + char + text.substring(index);

    selection.start += 1;
    selection.end += 1;

    this.onChange(this.refs.editable.getDOMNode(), selection, this.props.element);

    event.preventDefault();
  },

  onKeyDown: function (event) {
    if (event.keyCode === 8) {
      this.deleteSelection();
    }

    event.preventDefault();
  },

  deleteSelection: function() {
    const windowSelection = window.getSelection();
    const [beginFragmentIndex, beginDOMNode] = getFragmentWrapper(windowSelection.baseNode);
    const [endFragmentIndex, endDOMNode] = getFragmentWrapper(windowSelection.extentNode);

    if (beginFragmentIndex === endFragmentIndex) {
      const selection = serialiseSelection(beginDOMNode, windowSelection);
      this.changeFragment(beginFragmentIndex, {
        text: deleteFromFragment(this.state.content[beginFragmentIndex].text, selection.start, selection.end)
      });

      selection.end = selection.start;
      this.setState({
        selection: {
          textIndexes: selection,
          fragmentIndex: beginFragmentIndex
        }
      });
    }
  },

  changeFragment: function(index, partialNewElement) {
    const fragments = clone(this.state.content);
    assign(fragments[index], partialNewElement);
    this.setState({content: fragments});
  },

  getComponentForElement: function (fragment, index) {
    const Component = TYPE_TO_COMPONENT_MAP[fragment.type];
    return (<Component element={fragment} />);
  },

  render: function () {
    return (
      <div contentEditable="true" onContextMenu={this.onInput} onKeyPress={this.onKeyPress} onKeyDown={this.onKeyDown}>
        <For each="fragment" of={this.state.content} index="idx">
          <EntryElementWrapper ref={'fragment-' + idx} data-index={idx} key={idx}>
            {this.getComponentForElement(fragment, idx)}
          </EntryElementWrapper>
        </For>
      </div>
    );
  }
});

function deleteFromFragment(fragmentText, textIndexStart = 0, textIndexEnd = undefined) {
  textIndexEnd = textIndexEnd || fragmentText.length

  return fragmentText.substring(0, textIndexStart) + fragmentText.substring(textIndexEnd);
}

function getFragmentWrapper(element) {
  const indexStr = element.getAttribute && element.getAttribute('data-index');
  const index = indexStr ? parseInt(indexStr) : null;

  if (Number.isInteger(index)) {
    return [parseInt(indexStr), element];
  } else if (element.parentNode) {
    return getFragmentWrapper(element.parentNode);
  } else {
    throw new Error('Attempted to look for fragment but none found');
  }
}

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