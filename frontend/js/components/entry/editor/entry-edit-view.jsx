import React from 'react';
import Relay from 'react-relay';
import UpdateEntryMutation from '../../../mutations/update-entry-mutation';
import AddEntryMutation from '../../../mutations/add-entry-mutation';
import Editor from './editor';
import {withRouter} from 'react-router';

class EntryEditView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.authorise(this.props);
  }

  componentWillReceiveProps(props) {
    this.authorise(props);
  }

  authorise(props) {
    const viewer = props.viewer;

    if (!viewer.currentUser || (viewer.currentUser.userId !== viewer.blog.userId)) {
      props.router.push(`/blogs/${viewer.blog.blogId}`)
    }
  }

  onSubmit(event) {
    event.preventDefault();

    const entry = this.props.viewer.entry;
    const blog = this.props.viewer.blog;

    this.props.relay.commitUpdate(
      entry ?
        new UpdateEntryMutation({entry, ...this.getEntryDetails()}) :
        new AddEntryMutation({entry: this.getEntryDetails(), blogId: blog.blogId}),
      {
        onFailure: () => {
          this.setState({failure: true})
        },
        onSuccess: response => {
          const entryId = entry ? entry.entryId :
            response.addEntryToBlog.entryEdge.node.entryId;

          this.props.router.push(`/blogs/${blog.blogId}/entries/${entryId}`)
        }
      }
    );
  }

  getEntryDetails() {
    return {
      title: this.titleElement.value,
      markdown: JSON.stringify(this.editor.getContentState())
    };
  }

  render() {
    const entry = this.props.viewer.entry || {};

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <If condition={this.state.failure}>
          Update failed.
        </If>

        <div className="col-1-1">
          <input type="text" ref={node => this.titleElement = node} defaultValue={entry.title}/>
        </div>

        <div className="col-1-1">
          <Editor
            contentState={entry.markdown && JSON.parse(entry.markdown)}
            ref={editor => this.editor = editor}/>
        </div>

        <div className="col-1-1">
          <input type="submit" value="Save"/>
        </div>
      </form>
    );
  }
}

export default Relay.createContainer(withRouter(EntryEditView), {
  initialVariables: {
    entryId: null,
    blogId: null
  },

  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        currentUser {
          userId
        }
        blog(blogId: $blogId) {
          blogId
          name
          userId
        }
        entry(entryId: $entryId) {
          entryId
          title
          markdown
          ${UpdateEntryMutation.getFragment('entry')}
        }
      }
    `
  }
});