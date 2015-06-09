import IdBasedAjaxStore from './id-based-ajax-store';

export default class BlogStore extends IdBasedAjaxStore {
  constructor(flux) {
    super(result => result.entryId);

    this.entryActions = flux.getActions('entry');
    this.registerAsync(this.entryActions.getEntry, this.onLoading, this.onSuccess, this.onFailure);
  }

  getEntry(entryId) {
    if (!this.state.data[entryId] && !this.isLoading(entryId)) {
      this.entryActions.getEntry(entryId);
    }

    return this.state.data[entryId];
  }
}