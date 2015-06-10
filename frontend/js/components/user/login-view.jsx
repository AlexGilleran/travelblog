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
    const rememberMe = React.findDOMNode(this.refs.rememberMe).checked;

    const login = this.props.flux.getActions('login-state').login;

    login(email, password, rememberMe);
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
          <If condition={this.props.loggedIn}>
            <span>You are already logged in.</span>
          <Else />
            <form onSubmit={this.onSubmit.bind(this)}>
              <input type="text" placeholder="Email Address" ref="email" />
              <input type="password" placeholder="Password" ref="password" />
              <label>
                <input type="checkbox" value="rememberMe" ref="rememberMe" />
                Remember Me
              </label>
              <input type="submit">Login</input>
            </form>
          </If>
      </div>
    );
  }
}