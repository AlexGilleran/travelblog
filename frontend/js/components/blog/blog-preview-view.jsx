import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
  render() {
    const blog = this.props.blog;

    return (
      <div>
        <Link to="blog" params={blog}>{blog.name}</Link>
        <div>{blog.description}</div>
      </div>
    );
  }
});