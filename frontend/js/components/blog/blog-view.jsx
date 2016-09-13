var React = require('react');
import Relay from 'react-relay';
var BlogListView = require('./blog-list-view');
var EntryPreviewView = require('./../entry/entry-preview-view');

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
              {/*<For each="entry" of={blog.entries}>
                <EntryPreviewView key={entry.entryId} entry={entry}/>
              </For>*/}
            </div>
          </If>
        </div>
        <div className="col-1-3">
          {/*<BlogListView/>*/}
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
      }
    `
  },
});