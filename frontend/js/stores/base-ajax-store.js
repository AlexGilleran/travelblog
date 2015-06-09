import BaseStore from './base-store';

export default class BaseAjaxStore extends BaseStore {
  onFailure() {
    this.setState({
      failed: true,
      loading: false
    });
  }

  onLoading() {
    this.setState({
      failed: false,
      loading: true
    });
  }

  onSuccess(key, data) {
    var newState = {
      loading: false,
      failed: false
    };
    newState[key] = data;

    this.setState(newState);
  }
}