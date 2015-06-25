import {Actions} from 'flummox';
import api from '../api';
import {catchArguments} from './action-utils';
import isServer from '../util/is-server';

export default class LoginStateActions extends Actions {
  async login(email, password, rememberMe) {
    const userDetails = await api.login(email, password, rememberMe);

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

  //setSessionId(sessionId) {
  //  if (!isServer) {
  //    throw new Error('Trying to manually set session id when not on the server, this is not allowed');
  //  }
  //
  //  return sessionId;
  //}
}