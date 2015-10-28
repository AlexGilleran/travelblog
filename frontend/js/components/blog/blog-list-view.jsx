var React = require('react');
var FluxComponent = require('flummox/component');
import BlogPreviewView from './blog-preview-view';

export default class BlogListView extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores="blog-list">
        <Inner />
      </FluxComponent>
    );
  }
}

class Inner extends React.Component {
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