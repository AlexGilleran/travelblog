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
const reduce = require('lodash/collection/reduce');

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
      restoreSelection(this.getWrapperForIndex(this.state.selection.fragmentIndex).getDOMNode(), this.state.selection.textIndexes);
      this.setState({selection: undefined});
    }
  },

  getWrapperForIndex: function (index) {
    return this.refs['fragment-' + index];
  },

  onInput: function (event) {
    // if the user actually manages to edit the document in some way we haven't caught, immediately revert it.
    this.forceUpdate();
  },

  onKeyPress: function (event) {
    const char = String.fromCharCode(event.charCode);
    const [fragmentIndex, domNode] = getFragmentWrapper(window.getSelection().baseNode);
    const selection = serialiseSelection(domNode);

    const element = clone(this.state.content[fragmentIndex]);
    const index = selection.start;
    const text = element.text.substring(0, index) + char + element.text.substring(index);

    this.changeFragment(fragmentIndex, {
      text: text,
      formatting: shiftFormatting(element.formatting, index, 1)
    });

    selection.start += 1;
    selection.end += 1;

    this.setState({
      selection: {
        textIndexes: selection,
        fragmentIndex: fragmentIndex
      }
    });

    event.preventDefault();
  },

  onKeyDown: function (event) {
    switch (event.keyCode) {
      case 8:
        this.deleteSelection(-1);
        event.preventDefault();
        break;
      case 46:
        this.deleteSelection(1);
        event.preventDefault();
        break;
    }
  },

  deleteSelection: function (defaultDelta) {
    const windowSelection = window.getSelection();
    const [beginFragmentIndex, beginDOMNode] = getFragmentWrapper(windowSelection.baseNode);
    const [endFragmentIndex, endDOMNode] = getFragmentWrapper(windowSelection.extentNode);

    if (beginFragmentIndex === endFragmentIndex) {
      const selection = serialiseSelection(beginDOMNode, windowSelection);
      if (selection.start === selection.end) {
        if (defaultDelta < 0) {
          selection.start += defaultDelta;
        } else {
          selection.end += defaultDelta;
        }
      }

      const fragment = this.state.content[beginFragmentIndex];
      this.changeFragment(beginFragmentIndex, {
        text: deleteFromFragment(fragment.text, selection.start, selection.end),
        formatting: shiftFormatting(fragment.formatting, selection.start, selection.start - selection.end)
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

  changeFragment: function (fragmentIndex, partialNewElement) {
    const fragments = clone(this.state.content);
    assign(fragments[fragmentIndex], partialNewElement);
    this.setState({content: fragments});
  },

  getComponentForElement: function (fragment, index) {
    const Component = TYPE_TO_COMPONENT_MAP[fragment.type];
    return (<Component element={fragment}/>);
  },

  render: function () {
    return (
      <div contentEditable="true" onChange={this.onInput} onInput={this.onInput} onKeyPress={this.onKeyPress}
           onKeyDown={this.onKeyDown}>
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

function shiftFormatting(formatting, startIndex, delta) {
  return reduce(formatting, (acc, list, name) => {
    const newList = [];

    for (let i = 0; i < list.length; i++) {
      const formattingIndex = list[i];

      if (formattingIndex <= startIndex) {
        newList.push(formattingIndex);
      } else {
        const newIndex = formattingIndex + delta;
        if (newIndex === newList[newList.length - 1]) {
          // If this is the same as the last index, both cancel each other out so just pop the last one.
          newList.pop();
        } else {
          newList.push(Math.max(newIndex, startIndex));
        }
      }
    }

    acc[name] = newList;
    return acc;
  }, {});
}