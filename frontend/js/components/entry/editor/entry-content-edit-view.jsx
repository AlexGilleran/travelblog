const React = require('react');
const EntryStoreModule = require('../../../stores/entry-store');
const {Link} =  require('react-router');
const FluxComponent = require('flummox/component');
const clone = require('lodash/lang/clone');
const EntryElementWrapper = require('../entry-element-wrapper');
const EntryImageView = require('../view/entry-image-view');
const EntryParagraphEditView = require('./entry-paragraph-edit-view');
const {serialiseSelection, restoreSelection} = require('./save-selection');

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
      restoreSelection(this.state.selection.node, this.state.selection.indexes);
      this.setState({selection: undefined});
    }
  },

  onChange: function (index, domNode, selection, fragment) {
    const content = clone(this.state.content);

    content[index] = fragment;

    this.setState({
      content: content,
      selection: {
        node: domNode,
        indexes: selection
      }
    });
  },

  getComponentForElement: function (fragment, index) {
    const Component = TYPE_TO_COMPONENT_MAP[fragment.type];
    return (<Component element={fragment} onChange={this.onChange.bind(this, index)}/>);
  },

  render: function () {
    return (
      <div>
        <For each="fragment" of={this.state.content} index="idx">
          <EntryElementWrapper key={idx}>
            {this.getComponentForElement(fragment, idx)}
          </EntryElementWrapper>
        </For>
      </div>
    );
  }
});