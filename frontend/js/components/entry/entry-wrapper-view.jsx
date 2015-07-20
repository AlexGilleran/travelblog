var React = require('react');
var EntryStoreModule = require('../../stores/entry-store');
var {Link, RouteHandler} =  require('react-router');
import FluxComponent from 'flummox/component';

export default class EntryView extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={{
          entry: store => ({
            entry: store.getEntry(this.props.routerState.params.entryId),
            status: store.getStatus(this.props.routerState.params.entryId)
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