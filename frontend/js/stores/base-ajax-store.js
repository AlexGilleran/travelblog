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
    this.setState({
      status: {
        type: 'error',
        error: error
      }
    });
  }

  onLoading() {
    this.setState({
      status: {
        type: 'loading',
      }
    });
  }

  onSuccess(data) {
    var newState = {
      status: {
        type: 'success'
      }
    };
    if (this.dataKey) {
      newState[this.dataKey] = data;
    }

    this.setState(newState);
  }

  getStatus() {
    return this.state.status || {};
  }
}