var React = require('react');
var EntryStoreModule = require('../stores/entry-store');
var {Link} =  require('react-router');

export default class EntryView extends React.Component {
  function() {
    return (
      <FluxComponent connectToStores={{
          entry: store => {
            store.getEntry(this.params.entryId)
          }
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
        <h2 className="col-1-1">
          {this.state.title}
        </h2>

        <div className="col-1-1">
          {this.state.markdown}
        </div>
        <div className="col-1-1">
          <If condition={this.props.entry.blogId}>
            <Link to="blogs" params={this.props.entry}>Back to Blog</Link>
          </If>
        </div>
      </div>
    );
  }
}