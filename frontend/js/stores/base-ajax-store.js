import BaseStore from './base-store';

export default class BaseAjaxStore extends BaseStore {
  constructor(dataKey) {
    super();

    this.state = {
      status: {}
    };

    this.dataKey = dataKey;
  }

  onFailure(error) {
    const status = 'error';
    status.error = error;
    this.setState({
      status: status
    });
  }

  onLoading() {
    this.setState({
      status: 'loading'
    });
  }

  onSuccess(data) {
    var newState = {
      status: 'success'
    };
    if (this.dataKey) {
      newState[this.dataKey] = data;
    }

    this.setState(newState);
  }

  getStatus() {
    return this.state.status;
  }
}