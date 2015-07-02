var React = require('react');
var {Link} =  require('react-router');
var FluxComponent = require('flummox/component');

export default class LoginView extends React.Component {
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

    const email = React.findDOMNode(this.refs.email).value;
    const password = React.findDOMNode(this.refs.password).value;

    const login = this.props.flux.getActions('login-state').login;

    login(email, password);
  }

  render() {
    return (
      <div>
          <If condition={this.props.loginInProgress}>
            <span>Logging in...</span>
          </If>
          <If condition={this.props.loginFailed}>
            <span>Login failed: {this.props.loginFailureReason}</span>
          </If>
          <If condition={this.props.userDetails}>
            <span>Logged in as {this.props.userDetails.userName}.</span>
          <Else />
            <form onSubmit={this.onSubmit.bind(this)}>
              <input type="text" placeholder="Email Address" ref="email" />
              <input type="password" placeholder="Password" ref="password" />
              <input type="submit" value="Login" />
              <Link to="register">Sign Up</Link>
            </form>
          </If>
      </div>
    );
  }
}