var React = require('react');
var {Link} =  require('react-router');

export default class EntryPreviewView extends React.Component {
  render() {
    return (
      <FluxComponent>
        <Inner />
      </FluxComponent>
    );
  }
};

class Inner extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h3>
            <Link to="entries" params={this.props.entry}>{this.props.entry.title}</Link>
          </h3>
        </div>
        <div>{this.props.entry.markdown}</div>
      </div>
    );
  }
}