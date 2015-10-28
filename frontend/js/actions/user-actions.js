import {Actions} from 'flummox';
import api from '../api';
import {catchArguments} from './action-utils';

export default class UserActions extends Actions {
  async getUser(userId) {
    const user = await catchArguments(api.getUser, userId);
    user.id = userId;
    return user;
  }
}