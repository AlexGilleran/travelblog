import React from 'react';
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';

export default class EntryEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.props.contentState ?
        EditorState.createWithContent(convertFromRaw(this.props.contentState)) :
        EditorState.createEmpty()
    };

    this.onChange = this.onChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  onChange(editorState) {
    this.setState({editorState});
  }

  getContentState() {
    return convertToRaw(this.state.editorState.getCurrentContent());
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    return (
      <Editor
        handleKeyCommand={this.handleKeyCommand}
        editorState={this.state.editorState}
        onChange={this.onChange}/>
    );
  }
}
