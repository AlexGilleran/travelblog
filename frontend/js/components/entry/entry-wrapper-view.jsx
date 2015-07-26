var React = require('react');
var EntryStoreModule = require('../../stores/entry-store');
var {Link, RouteHandler} =  require('react-router');
import FluxComponent from 'flummox/component';

export default class EntryView extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={{
          entry: store => {
            const entryId = this.props.routerState.params.entryId;
            const entryData = store.getEntry(this.props.routerState.params.entryId) || {};

            return {
              entry: entryData.entry,
              blog: entryData.blog,
              status: store.getStatus(this.props.routerState.params.entryId)
            }
          },
          'login-state': store => ({
            userDetails: store.getUserDetails() || {}
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
        <If condition={this.props.entry}>
          <div>
            <RouteHandler {...this.props} />

            <div className="col-1-1">
              <Link to="blog" params={this.props.blog}>Back to Blog</Link>
            </div>
          </div>
          <Else />

          <div>No entry data</div>
        </If>
        <If condition={this.props.status.type === 'updating'}>
          <span>Updating</span>
        </If>
      </div>
    );
  }
}