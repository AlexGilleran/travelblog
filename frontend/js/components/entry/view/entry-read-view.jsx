var React = require('react');
var EntryStoreModule = require('../../../stores/entry-store');
var {Link} =  require('react-router');
import FluxComponent from '../../../../node_modules/flummox/component';

export default class EntryReadView extends React.Component {
  render() {
    return (
      <div>
        <h2 className="col-1-1">
          {this.props.entry.title}
        </h2>
        <If condition={this.props.userDetails.userId === this.props.blog.userId} >
          <div className="col-1-1">
            <Link to="editEntry" params={this.props.entry}>Edit</Link>
          </div>
        </If>
        <div className="col-1-1">
          {this.props.entry.markdown}
        </div>
      </div>
    );
  }
}