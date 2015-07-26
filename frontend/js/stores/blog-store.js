import IdBasedAjaxStore from './id-based-ajax-store';

export default class BlogStore extends IdBasedAjaxStore {
  constructor(flux) {
    super(result => result.details.blogId);

    this.blogActions = flux.getActions('blog');
    this.registerAsync(this.blogActions.getBlog, this.onLoading, this.onSuccess, this.onFailure);
  }

  getBlog(blogId) {
    if (!this.state.data[blogId] && this.getStatus(blogId) !== 'loading') {
      this.blogActions.getBlog(blogId);
    }

    return this.state.data[blogId];
  }
}