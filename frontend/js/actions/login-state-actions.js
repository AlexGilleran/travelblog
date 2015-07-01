import {Actions} from 'flummox';
import api from '../api';
import {catchArguments} from './action-utils';
import isServer from '../util/is-server';

export default class LoginStateActions extends Actions {
  async login(email, password) {
    const userDetails = await api.login(email, password);

    this.notifyLoggedIn(userDetails);

    return userDetails;
  }

  async initWithSession(sessionId) {
    return await api.getUserForSession(sessionId);
  }

  notifyLoggedIn(userDetails) {
    return userDetails;
  }

  notifyLoggedOut() {
    return true;
  }

  async register(userDetails) {
    const loggedInUserDetails = await api.register(userDetails);

    this.notifyLoggedIn(loggedInUserDetails);

    return loggedInUserDetails;
  }
}