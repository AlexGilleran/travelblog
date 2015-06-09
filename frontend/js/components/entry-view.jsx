var React = require('react');
var EntryStoreModule = require('../stores/entry-store');
var {Link} =  require('react-router');
import FluxComponent from 'flummox/component';

export default class EntryView extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={{
          entry: store => ({
            entry: store.getEntry(this.props.routerState.params.entryId)
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
      <If condition={this.props.entry}>
        <div>
          <h2 className="col-1-1">
            {this.props.entry.title}
          </h2>

          <div className="col-1-1">
            {this.props.entry.markdown}
          </div>
          <div className="col-1-1">
            <If condition={this.props.entry.blogId}>
              <Link to="blogs" params={this.props.entry}>Back to Blog</Link>
            </If>
          </div>
        </div>
      <Else />
        <div>No entry data</div>
      </If>
    );
  }
}