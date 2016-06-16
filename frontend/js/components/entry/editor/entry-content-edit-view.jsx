const React = require('react');
const {Link} =  require('react-router');
const EntryElementWrapper = require('../entry-element-wrapper');
const EntryImageView = require('../view/entry-image-view');
const EntryParagraphEditView = require('./entry-paragraph-edit-view');
const {serialiseSelection, restoreSelection} = require('./save-selection');
const _ = require('lodash');

const TYPE_TO_COMPONENT_MAP = {
  para: EntryParagraphEditView,
  image: EntryImageView
};

module.exports = React.createClass({
  getInitialState() {
    return {
      content: this.props.content,
      remountCount: 0
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

  remount: function (event) {
    // if the user actually manages to edit the document in some way we haven't caught, immediately revert it otherwise
    // react will cry because we've modified its DOM without telling it.

    // this is a bit of a hack - changing the key on a node completely remounts it.
    this.setState({remountCount: this.state.remountCount + 1});
  },

  onKeyPress: function (event) {
    const [fragmentIndex, domNode] = getFragmentWrapper(window.getSelection().anchorNode);
    const selection = serialiseSelection(domNode);

    // If a text range is selected, delete it first.
    if (selection.start !== selection.end) {
      this.deleteSelection(0);
      selection.end = selection.start;
    }

    const fragment = _.clone(this.state.content[fragmentIndex]);
    const index = selection.start;

    let text, selectionFragmentIndex;

    if (event.charCode === 13) { // enter
      const firstFrag = deleteFromFragment(fragment, index);
      const secondFrag = deleteFromFragment(fragment, 0, index);

      this.mutateFragment(fragmentIndex, firstFrag);
      this.addFragment(fragmentIndex, secondFrag);

      selectionFragmentIndex = fragmentIndex + 1;
      selection.start = 0;
      selection.end = 0;
    } else {
      const char = String.fromCharCode(event.charCode);
      text = fragment.text.substring(0, index) + char + fragment.text.substring(index);
      selectionFragmentIndex = fragmentIndex;

      selection.start += 1;
      selection.end += 1;

      this.mutateFragment(fragmentIndex, {
        text: text,
        formatting: shiftFormatting(fragment.formatting, Math.max(0, index - 1), 1)
      });
    }

    this.setState({
      selection: {
        textIndexes: selection,
        fragmentIndex: selectionFragmentIndex
      }
    });

    event.preventDefault();
  },

  onKeyDown: function (event) {
    switch (event.keyCode) {
      case 8:
        this.deleteSelection(-1);
        event.preventDefault();
        event.stopPropagation();
        break;
      case 46:
        this.deleteSelection(1);
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  },

  deleteSelection: function (defaultDelta) {
    const windowSelection = window.getSelection();
    let [beginFragmentIndex, beginDOMNode] = getFragmentWrapper(windowSelection.anchorNode);
    let [endFragmentIndex, endDOMNode] = getFragmentWrapper(windowSelection.focusNode);

    // If begin and end are upside down, swap them so beginFragmentIndex is always higher up the page.
    if (beginFragmentIndex > endFragmentIndex) {
      [beginFragmentIndex, beginDOMNode, endFragmentIndex, endDOMNode] =
        [endFragmentIndex, endDOMNode, beginFragmentIndex, beginDOMNode];
    }

    // Sanitise selection
    const selectionToDelete = serialiseSelection(beginDOMNode, windowSelection);
    if (selectionToDelete.start === selectionToDelete.end) {
      if (defaultDelta < 0) {
        selectionToDelete.start += defaultDelta;
      } else {
        selectionToDelete.end += defaultDelta;
      }
    }

    // Delete partial from start fragment
    this.deletePartOfFragment(beginFragmentIndex, selectionToDelete.start, selectionToDelete.end);

    if (beginFragmentIndex !== endFragmentIndex) {
      // Delete middle fragments if they exist
      while (beginFragmentIndex + 1 < endFragmentIndex) {
        this.deleteWholeFragment(beginFragmentIndex + 1);
        endFragmentIndex--;
      }

      // Delete partial from end fragment
      // FIXME: zomg this next line egh.
      this.deletePartOfFragment(endFragmentIndex, 0, window.getSelection().getRangeAt(0).endOffset);

      this.mergeFragments(beginFragmentIndex, endFragmentIndex);
    }

    this.setState({
      selection: {
        textIndexes: {
          start: selectionToDelete.start,
          end: selectionToDelete.start
        },
        fragmentIndex: beginFragmentIndex
      }
    });
  },

  mergeFragments: function (startFragIndex, endFragIndex) {
    const newFrag = concatFragments(this.state.content[startFragIndex], this.state.content[endFragIndex]);

    this.mutateFragment(startFragIndex, newFrag);
    this.deleteWholeFragment(endFragIndex);
  },

  deletePartOfFragment: function (fragmentIndex, begin, end) {
    const fragment = this.state.content[fragmentIndex];

    this.mutateFragment(fragmentIndex, deleteFromFragment(fragment, begin, end));
  },

  deleteWholeFragment: function (fragmentIndex) {
    this.state.content.splice(fragmentIndex, 1);

    this.setState({content: this.state.content});
  },

  getFragForEditing: function (fragmentIndex) {
    return _.clone(this.state.content[fragmentIndex]);
  },

  mutateFragment: function (fragmentIndex, partialNewElement) {
    _.assign(this.state.content[fragmentIndex], partialNewElement);
    this.setState({content: this.state.content});
  },

  addFragment: function(addAfterFragmentIndex, newFragment) {
    this.state.content.splice(addAfterFragmentIndex + 1, 0, newFragment);
    this.setState({content: this.state.content});
  },

  getComponentForElement: function (fragment, index) {
    const Component = TYPE_TO_COMPONENT_MAP[fragment.type];
    return (<Component element={fragment}/>);
  },

  render: function () {
    return (
      <div contentEditable="true" onChange={this.remount} onInput={this.remount} onKeyPress={this.onKeyPress}
           onKeyDown={this.onKeyDown} key={this.state.remountCount}>
        <For each="fragment" of={this.state.content} index="idx">
          <EntryElementWrapper ref={'fragment-' + idx} data-index={idx} key={idx}>
            {this.getComponentForElement(fragment, idx)}
          </EntryElementWrapper>
        </For>
      </div>
    );
  }
});

function deleteFromFragment(fragment, begin, end = fragment.text.length) {
  return _.extend(_.clone(fragment), {
    text: sliceText(fragment.text, begin, end),
    formatting: shiftFormatting(fragment.formatting, begin, begin - end)
  });
}

function sliceText(fragmentText, textIndexStart = 0, textIndexEnd = undefined) {
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
  return _.reduce(formatting, (acc, list, name) => {
    const shiftedFormatting = [];

    for (let i = 0; i < list.length; i++) {
      const formattingIndex = list[i];

      if (formattingIndex <= startIndex) {
        shiftedFormatting.push(formattingIndex);
      } else {
        const shiftedFormattingIndex = formattingIndex + delta;
        if (shiftedFormattingIndex === shiftedFormatting[shiftedFormatting.length - 1]) {
          // If this is the same as the last index, both cancel each other out so just pop the last one.
          shiftedFormatting.pop();
        } else {
          shiftedFormatting.push(Math.max(shiftedFormattingIndex, startIndex));
        }
      }
    }

    acc[name] = shiftedFormatting;
    return acc;
  }, {});
}

function concatFragments(firstFrag, secondFrag) {
  if (firstFrag.type !== 'para' || secondFrag.type !== 'para') {
    throw new Error('Attempting to concat two non-text fragments!');
  }

  const newFrag = _.clone(firstFrag);
  newFrag.text = firstFrag.text + secondFrag.text;

  const shiftedSecondFragFormatting = shiftFormatting(secondFrag.formatting, 0, firstFrag.text.length);
  newFrag.formatting = _.mapValues(firstFrag.formatting, (value, key) => value.concat(shiftedSecondFragFormatting[key] || []));

  return newFrag;
}