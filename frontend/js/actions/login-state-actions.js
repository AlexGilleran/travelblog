import {Actions} from 'flummox';
import api from '../api';
import {catchArguments} from './action-utils';

export default class LoginStateActions extends Actions {
  async login(email, password, rememberMe) {
    const userDetails = await api.login(email, password, rememberMe);

    this.notifyLoggedIn(userDetails);

    return userDetails;
  }

  notifyLoggedIn(userDetails) {
    return userDetails;
  }

  notifyLoggedOut() {
    return true;
  }
}