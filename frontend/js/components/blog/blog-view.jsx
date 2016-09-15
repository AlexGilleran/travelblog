import React from 'react';
import Relay from 'react-relay';
import BlogListView from './blog-list-view';
import EntryPreviewView from '../entry/entry-preview-view';

class BlogView extends React.Component {
  render() {
    const blog = this.props.blog;

    return (
      <div>
        <div className="col-2-3">
          <If condition={blog}>
            <div>
              <div>
                <h2>{blog.name}</h2>
              </div>
              <For each="entry" of={blog.entries}>
                <EntryPreviewView key={entry.entryId} entry={entry}/>
              </For>
            </div>
          </If>
        </div>
        <div className="col-1-3">
          <BlogListView blogList={this.props.viewer.blogs} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(BlogView, {
  fragments: {
    blog: () => Relay.QL`
      fragment on Blog {
        name
        entries {
          entryId
          ${EntryPreviewView.getFragment('entry')}          
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Viewer {
        blogs(first: 3) {
          ${BlogListView.getFragment('blogList')}
        }
      }
    `
  },
});