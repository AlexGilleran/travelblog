import IdBasedAjaxStore from './id-based-ajax-store';

export default class BlogStore extends IdBasedAjaxStore {
  constructor(flux) {
    super();

    this.entryActions = flux.getActions('entry');
    this.registerAsync(this.entryActions.getBlogList, this.onLoading, this.onSuccess, this.onFailure);
  }

  getEntry(entryId) {
    if (this.entries[entryId]) {
      return this.entries[entryId];
    } else {
      this.entryActions.loadEntry(entryId);
    }
  }
}