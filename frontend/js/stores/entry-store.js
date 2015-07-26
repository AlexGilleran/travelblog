import IdBasedAjaxStore from './id-based-ajax-store';

export default class EntryStore extends IdBasedAjaxStore {
  constructor(flux) {
    super(result => result.entry.entryId);

    this.entryActions = flux.getActions('entry');
    this.registerAsync(this.entryActions.getEntry, this.onLoading, this.onSuccess, this.onFailure);
    this.registerAsync(this.entryActions.updateEntry, this.onUpdating, this.onSuccess, this.onUpdateFailure);
  }

  getEntry(entryId) {
    if (!this.state.data[entryId] && this.getStatus(entryId) !== 'loading') {
      this.entryActions.getEntry(entryId);
    }

    return this.state.data[entryId];
  }
}