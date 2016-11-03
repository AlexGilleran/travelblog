import React from 'react';
import {Editor, EditorState, convertFromRaw} from 'draft-js';

export default function Viewer(props) {
  const state = props.rawContentState ?
    EditorState.createWithContent(convertFromRaw(JSON.parse(props.rawContentState))) :
    EditorState.createEmpty();
  
  return (
    <Editor
      readOnly={true}
      editorState={state}>
    </Editor>
  );
}