import IdBasedAjaxStore from './id-based-ajax-store';

export default class BlogStore extends IdBasedAjaxStore {
  constructor(flux) {
    super();

    this.blogActions = flux.getActions('blog');
    this.registerAsync(this.blogActions.getBlog, this.onLoading, this.onSuccess, this.onFailure);
  }

  getBlog(blogId) {
    if (this.data[blogId]) {
      return this.data[blogId];
    } else {
      blogActions.getBlog(blogId);
    }
  }
}