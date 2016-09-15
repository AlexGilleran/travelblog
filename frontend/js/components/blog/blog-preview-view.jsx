import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

class BlogPreviewView extends React.Component {
  render() {
    const blog = this.props.blog;

    return (
      <div>
        <Link to={`blogs/${blog.blogId}`} params={blog}>{blog.name}</Link>
        <div>{blog.description}</div>
      </div>
    );
  }
}

export default Relay.createContainer(BlogPreviewView, {
  fragments: {
    blog: () => Relay.QL`
      fragment on Blog {
        blogId,
        name,
        description
      }
    `
  },
});