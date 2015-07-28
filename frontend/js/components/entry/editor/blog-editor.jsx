var React = require('react');
var EntryStoreModule = require('../../../stores/entry-store');
var {Link} =  require('react-router');
import FluxComponent from 'flummox/component';
import {serialiseSelection, restoreSelection} from './save-selection';
import toMarkdownEscd from './to-markdown-escaped';
const clone = require('lodash/lang/clone');

const SPACE_REGEX = new RegExp('\\s\\s', 'g');

const BlogElementWrapper = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  render: function () {
    return (
      <p>
        {this.props.children}
      </p>
    );
  }
});

class BlogParagraph extends React.Component {
  onKeyPress(event) {
    const char = String.fromCharCode(event.charCode);
    const selection = serialiseSelection(this.refs.editable.getDOMNode());
    const text = event.target.innerText;

    this.props.element.text = text.substring(0, selection.start) + char + text.substring(selection.start);

    selection.start += 1;
    selection.end += 1;

    this.props.onChange(this.refs.editable.getDOMNode(), selection, this.props.element);

    event.preventDefault();
  }

  render() {
    // TODO: Parse subset of markdown.
    return <span ref="editable" contentEditable="true"
                 onKeyPress={this.onKeyPress.bind(this)}>{this.props.element.text}</span>;
  }
}

class BlogImage extends React.Component {
  render() {
    return (<img alt={this.props.element.alt} src={this.props.element.url}/>);
  }
}

const TYPE_TO_COMPONENT_MAP = {
  para: BlogParagraph,
  image: BlogImage
};

const exampleTbDom = [
  {
    type: 'para',
    text: 'Blah blah blah _hello_ blah *mcblah*'
  }, {
    type: 'para',
    text: 'this is para 2'
  }, {
    type: 'image',
    url: 'http://www.chanel.com/en_US/fragrance-beauty/views/assets/img/chanel_logo_blk.png',
    alt: 'blah blah'
  }, {
    type: 'para',
    text: 'this is para 3'
  }
];


export default class BlogEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tbDom: exampleTbDom
    };
  }


  componentDidUpdate() {
    if (this.state.selection) {
      restoreSelection(this.state.selection.node, this.state.selection.indexes);
      this.setState({selection: undefined});
    }
  }

  onChange(index, domNode, selection, element) {
    const tbDom = clone(this.state.tbDom);

    tbDom[index] = element;

    this.setState({
      tbDom: tbDom,
      selection: {
        node: domNode,
        indexes: selection
      }
    });
  }

  getComponentForElement(element, index) {
    const Component = TYPE_TO_COMPONENT_MAP[element.type];
    return (<Component element={element} onChange={this.onChange.bind(this, index)}/>);
  }

  render() {
    return (
      <div>
        <div
          ref="markdown">
          <For each="element" of={this.state.tbDom} index="idx">
            <BlogElementWrapper key={idx}>
              {this.getComponentForElement(element, idx)}
            </BlogElementWrapper>
          </For>
        </div>
      </div>
    );
  }
}