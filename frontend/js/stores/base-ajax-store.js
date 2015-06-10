import BaseStore from './base-store';

export default class BaseAjaxStore extends BaseStore {
  constructor(dataKey) {
    super();

    this.dataKey = dataKey;
  }

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

  onSuccess(data) {
    var newState = {
      loading: false,
      failed: false
    };
    if (this.dataKey) {
      newState[this.dataKey] = data;
    }

    this.setState(newState);
  }
}