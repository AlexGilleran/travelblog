var React = require('react');
import LoginView from './login-view';
import {Link} from 'react-router';

export default class HeaderView extends React.Component {
  render() {
    return (
      <div className="col-1-1">
        <div className="content pull-left">
          <Link to="app">
            <h1>Blog</h1>
          </Link>
        </div>
        <div className="pull-right">
          <LoginView flux={this.props.flux} />
        </div>
      </div>
    );
  }
};