var React = require('react');
var {Link, RouteHandler} =  require('react-router');

export default class EntryView extends React.Component {
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