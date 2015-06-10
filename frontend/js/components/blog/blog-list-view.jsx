var React = require('react');
var {Link} =  require('react-router');
var FluxComponent = require('flummox/component');

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
            <div key={blog.blogId}>
              <Link to="blogs" params={blog}>{blog.name}</Link>
            </div>
          </For>
        </If>
      </div>
    );
  }
}