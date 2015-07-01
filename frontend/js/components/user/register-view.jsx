var React = require('react');
var {Link} =  require('react-router');
var FluxComponent = require('flummox/component');
var EditUserView = require('./edit-user-view');

export default class RegisterView extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores="login-state">
        <Inner />
      </FluxComponent>
    );
  }
}

class Inner extends React.Component {
  onSubmit(event) {
    event.preventDefault();

    const userDetails = this.refs.editUserView.getUserDetails();

    const register = this.props.flux.getActions('login-state').register;

    register(this.refs.editUserView.getUserDetails());
  }

  render() {
    return (
      <div>
          <form onSubmit={this.onSubmit.bind(this)}>
            <EditUserView userDetails={this.props.userDetails} ref="editUserView" />
            <input type="submit" value="Register" />
          </form>
      </div>
    );
  }
}