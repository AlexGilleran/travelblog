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
    const id = error.args[0]
    this.state.status[id] = 'error';
    this.state.status[id].error = error;

    this.forceUpdate();
  }

  onUpdateFailure(error) {
    const id = this.idGetter(error.args[0]);
    this.state.status[id] = 'error';
    this.state.status[id].error = error;

    this.forceUpdate();
  }

  onLoading(id) {
    this.state.status[id] = 'loading';
    this.forceUpdate();
  }

  onSuccess(result) {
    const id = this.idGetter(result);
    this.state.status[id] = 'success';
    this.state.data[id] = result;
    this.forceUpdate();
  }

  onUpdating(object) {
    const id = this.idGetter(object)
    this.state.status[id] = 'updating';
    this.forceUpdate();
  }

  getStatus(id) {
    return this.state.status[id];
  }
}