import Store from './base-store';

export default class IdBasedAjaxStore extends Store {
  constructor(idGetter) {
    super();

    this.idGetter = idGetter;

    this.state = {
      status: {},
      data: {}
    };
  }

  onFailure(error) {
    this.state.status[error.arguments[0]] = {
      type: 'error',
      error: error
    };

    this.forceUpdate();
  }

  onLoading(id) {
    this.state.status[id] = {type: 'loading'};
    this.forceUpdate();
  }

  onSuccess(result) {
    const id = this.idGetter(result);
    this.state.status[id] = {type: 'success'};
    this.state.data[id] = result;
    this.forceUpdate();
  }

  onUpdating(object) {
    const id = this.idGetter(object)
    this.state.status[id] = {type: 'updating'};
    this.forceUpdate();
  }

  getStatus(id) {
    return this.state.status[id] || {};
  }
}