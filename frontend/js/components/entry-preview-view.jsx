var React = require('react');
import {Link} from 'react-router';

export default class EntryPreviewView extends React.Component {
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