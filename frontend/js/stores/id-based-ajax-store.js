import Store from './base-store';

export default class IdBasedAjaxStore extends Store {
  constructor(dataName) {
    super();

    this.dataName = dataName;

    this.state = {
      status: {}
    };
    this.state[dataName] = {};
  }

  onFailure(error) {
    this.state.status[error.arguments[0]] = {
      failed: true,
      error: error,
      loading: false
    };
    this.forceUpdate();
  }

  onLoading(id) {
    this.state.status[id] = {
      failed: false,
      loading: true
    };
    this.forceUpdate();
  }

  onSuccess(result) {
    this.state.status[result.id] = {
      failed: false,
      loading: false
    };
    this.state[result.id] = result.data;
    this.forceUpdate();
  }
}