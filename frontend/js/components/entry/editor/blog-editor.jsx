var React = require('react');
var EntryStoreModule = require('../../../stores/entry-store');
var {Link} =  require('react-router');
import FluxComponent from 'flummox/component';
import {serialiseSelection, restoreSelection} from './save-selection';
import toMarkdownEscd from './to-markdown-escaped';
const clone = require('lodash/lang/clone');
const reduce = require('lodash/collection/reduce');
const indexBy = require('lodash/collection/indexBy');

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

const INLINE_FORMATTERS = [
  {
    symbol: '_',
    wrap: toWrap => (<em>{toWrap}</em>)
  }, {
    symbol: '*',
    wrap: toWrap => (<strong>{toWrap}</strong>)
  }
];

class BlogParagraph extends React.Component {

  onKeyPress(event) {
    const char = String.fromCharCode(event.charCode);
    const selection = serialiseSelection(this.refs.editable.getDOMNode());

    const text = this.props.element.text;
    const index = selection.start + calcOffset(text, selection.start);
    this.props.element.text = text.substring(0, index) + char + text.substring(index);

    selection.start += 1;
    selection.end += 1;

    this.props.onChange(this.refs.editable.getDOMNode(), selection, this.props.element);

    event.preventDefault();
  }

  onKeyDown(event) {
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
  }

  getContents() {
    const md = this.props.element.text;

    function parse(formatters, md, outerInBlock = false) {
      if (!formatters.length) {
        return [md, false];
      }

      const formatter = formatters[0];
      const restOfFormatters = formatters.slice(1);

      const splitMd = splitWithEscaping(md, formatter.symbol, '\\');

      let innerInBlock = false;
      return [splitMd.map(function (block, index) {
        const lastSplit = index < splitMd.length - 1;
        const [inner, _inBlock] = parse(restOfFormatters, block, innerInBlock);
        innerInBlock = _inBlock;

        const val = outerInBlock ? formatter.wrap(inner) : inner;
        outerInBlock = lastSplit ? !outerInBlock : outerInBlock;

        return val;
      }), outerInBlock];
    }

    return parse(INLINE_FORMATTERS, this.props.element.text)[0];
  }

  render() {
    return (
      <span ref="editable" contentEditable="true" onKeyPress={this.onKeyPress.bind(this)} onKeyDown={this.onKeyDown.bind(this)}>
        {this.getContents()}
      </span>
    );
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

const EXAMPLE_TB_DOM = [
  {
    type: 'para',
    text: 'Blah _b*l*a_h *b_l_a*h _h*e_l*o *b\\_l*a\\_h mcblah'
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

const INLINE_FORMATTERS_LOOKUP = indexBy(INLINE_FORMATTERS, formatter => formatter.symbol);

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

function splitWithEscaping(string, char, escapeChar) {
  const acc = [[]];

  for (let i = 0; i < string.length; i++) {
    const thisChar = string.charAt(i);
    const lastChar = i > 0 ? string.charAt(i - 1) : undefined;

    if (thisChar === char && lastChar !== escapeChar) {
      acc.push([]);
    } else {
      if (thisChar === char) {
        acc[acc.length - 1].pop();
      }

      acc[acc.length - 1].push(thisChar);
    }
  }

  return acc.map(arr => arr.join(''));
}

export default class BlogEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tbDom: EXAMPLE_TB_DOM
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