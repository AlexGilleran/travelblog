import React from 'react';
import BlogPreviewView from './blog-preview-view';
import Relay from 'react-relay';

class BlogListView extends React.Component {
  render() {
    return (
      <div>
        <If condition={this.props.blogList && this.props.blogList.map}>
          <For each="blog" of={this.props.blogList}>
            <BlogPreviewView blog={blog} key={blog.blogId} />
          </For>
        </If>
      </div>
    );
  }
}

export default Relay.createContainer(BlogListView, {
  fragments: {
    blogList: () => Relay.QL`
      fragment on Blog @relay(plural: true) {
        blogId,
        name
      }
    `,
  },
});