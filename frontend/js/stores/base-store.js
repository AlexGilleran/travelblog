import {Store} from 'flummox';

export default class BaseStore extends Store {
  static serialize(state) {
    return JSON.stringify(state);
  }

  static deserialize(state) {
    return JSON.parse(state);
  }
}