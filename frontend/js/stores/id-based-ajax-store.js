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
      failed: true,
      error: error,
      loading: false
    };
    this.forceUpdate();
  }

  onLoading({actionArgs: [id]}) {
    this.state.status[id] = {
      failed: false,
      loading: true
    };
    this.forceUpdate();
  }

  onSuccess(idKey, {body: result}) {
    const id = this.idGetter(result);
    this.state.status[id] = {
      failed: false,
      loading: false
    };
    this.state.data[id] = result;
    this.forceUpdate();
  }

  isLoading(id) {
    return this.state.status[id] && this.state.status[id].loading;
  }
}