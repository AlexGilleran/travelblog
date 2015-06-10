import BaseStore from './base-store';

export default class LoginStateStore extends BaseStore {
  constructor(flux) {
    super();

    this.state = {};

    this.loginStateActions = flux.getActions('login-state');

    this.register(this.loginStateActions.notifyLoggedIn, this.onLoggedIn);
    this.register(this.loginStateActions.notifyLoggedOut, this.onLoggedOut);
    this.registerAsync(this.loginStateActions.login, this.onLoginStarted, this.onLoginSuccess, this.onLoginFailure);
  }

  onLoginStarted() {
    this.setState({loginInProgress: true, loginFailed: false});
  }

  onLoginSuccess() {
    this.setState({loginInProgress: false});
  }

  onLoginFailure(error) {
    this.setState({
      loginFailed: true,
      loginFailureReason: error.message,
      loginInProgress: false
    });
  }

  onLoggedIn(userDetails) {
    this.setState({
      loginInProgress: false,
      loggedIn: true,
      userDetails: userDetails
    });
  }

  onLoggedOut() {
    this.setState({
      loggedIn: false,
      userDetails: undefined
    });
  }
}