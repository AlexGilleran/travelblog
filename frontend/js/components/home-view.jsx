var React = require('react');
var BlogListView = require('./blog-list-view');

export default class HomeView extends React.Component {
    render() {
      return (
        <div>
          <div className="col-2-3">
            Home
          </div>
          <div className="col-1-3">
            <BlogListView flux={this.props.flux} />
          </div>
        </div>
      );
    }
};
