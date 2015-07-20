var React = require('react');
var EntryStoreModule = require('../../stores/entry-store');
var {Link} =  require('react-router');
import FluxComponent from 'flummox/component';

export default class EntryReadView extends React.Component {
  render() {
    return (
      <div>
        <h2 className="col-1-1">
          {this.props.entry.title}
        </h2>
        <div className="col-1-1">
          {this.props.entry.markdown}
        </div>
        <div className="col-1-1">
          <If condition={this.props.entry.blogId}>
            <Link to="blog" params={this.props.entry}>Back to Blog</Link>
          </If>
        </div>
      </div>
    );
  }
}