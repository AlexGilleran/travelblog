import BaseStore from './base-store';

export default class LoginStateStore extends BaseStore {
  constructor(flux) {
    super();

    this.state = {};

    this.loginStateActions = flux.getActions('login-state');

    this.register(this.loginStateActions.notifyLoggedIn, this.onLoggedIn);
    this.register(this.loginStateActions.notifyLoggedOut, this.onLoggedOut);
    this.registerAsync(this.loginStateActions.login, this.onLoginStarted, this.onLoginSuccess, this.onLoginFailure);

    // because it's only ever exec'd server side we don' need to keep track of loading state.
    this.registerAsync(this.loginStateActions.initWithSession, function() {}, this.onInitWithSessionSuccess, this.onInitWithSessionFailure);
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
      userDetails: userDetails
    });
  }

  onLoggedOut() {
    this.setState({
      userDetails: undefined
    });
  }

  onInitWithSessionSuccess(userDetails) {
    this.setState({
      userDetails: userDetails
    });
  }

  onInitWithSessionFailure(error) {
    console.log("session failure");
    this.setState({
      userDetails: undefined
    });
  }
}