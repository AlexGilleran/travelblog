import IdBasedAjaxStore from './id-based-ajax-store';

export default class UserStore extends IdBasedAjaxStore {
  constructor(flux) {
    super(result => result.id);

    this.userActions = flux.getActions('user');
    this.registerAsync(this.userActions.getUser, this.onLoading, this.onSuccess, this.onFailure);
  }

  getUser(userId) {
    if (!this.state.data[userId] && this.getStatus(userId) !== 'loading') {
      this.userActions.getUser(userId);
    }

    return this.state.data[userId];
  }
}