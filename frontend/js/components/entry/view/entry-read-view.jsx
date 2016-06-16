var React = require('react');
var {Link} =  require('react-router');

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