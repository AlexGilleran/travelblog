import {Store} from 'flummox';

export default class BaseStore extends Store {
  serialize() {
    return JSON.stringify(this.state);
  }

  deserialize() {
    return JSON.parse(this.state);
  }
}