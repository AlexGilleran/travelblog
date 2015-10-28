import React from 'react';
import FluxComponent from 'flummox/component';
import EntryPreviewView from '../entry/entry-preview-view.jsx';
import BlogPreviewView from '../blog/blog-preview-view';

module.exports = React.createClass({
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={{
        user: store => ({
          user: store.getUser(this.props.routerState.params.userId)
        })
      }}>
        <Inner />
      </FluxComponent>
    );
  }
});

const Inner = React.createClass({
  render() {
    return (
      <div className="col-3-3">
        <If condition={this.props.user}>
          <div>
            <h1>Details</h1>
            <DetailsView details={this.props.user.details}/>

            <h1>Recent Activity</h1>
            <For each="activity" of={this.props.user.activity}>
              <EntryPreviewView entry={activity} key={activity.entryId} />
            </For>

            <h1>Blogs</h1>
            <For each="blog" of={this.props.user.blogs}>
              <BlogPreviewView blog={blog} key={blog.blogId} />
            </For>
          </div>
        </If>
      </div>
    );
  }
});

const DetailsView = React.createClass({
  render() {
    const details = this.props.details;

    return (
      <div>
        <div><strong>{details.userName}</strong></div>
        <div>Name: {details.displayName}</div>
        <div>Avatar: <img src={details.avatarUrl}/></div>
        <div>Bio: {details.bio}</div>
      </div>
    );
  }
});