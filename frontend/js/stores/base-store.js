import {Store} from 'flummox';

export default class BaseStore extends Store {
  serialize() {
    console.log('state: ' + JSON.stringify(this.state));
    return JSON.stringify(this.state);
  }

  deserialize() {
    return JSON.parse(this.state);
  }
}