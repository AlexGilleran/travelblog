var React = require('react');
var BlogListView = require('./blog-list-view');
var EntryPreviewView = require('./../entry/entry-preview-view');
import FluxComponent from '../../../node_modules/flummox/component';

export default class BlogView extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={{
        blog: store => ({
          blog: store.getBlog(this.props.routerState.params.blogId)
        })
      }}>
        <Inner />
      </FluxComponent>
    );
  }
}

class Inner extends React.Component {
  render() {
    return (
      <div>
        <div className="col-2-3">
          <If condition={this.props.blog}>
            <div>
              <div>
                <h2>{this.props.blog.details.name}</h2>
              </div>
              <For each="entry" of={this.props.blog.entries}>
                <EntryPreviewView key={entry.entryId} entry={entry}/>
              </For>
            </div>
          </If>
        </div>
        <div className="col-1-3">
          <BlogListView flux={this.props.flux} />
        </div>
      </div>
    );
  }
}