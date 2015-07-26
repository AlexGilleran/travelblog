import BaseAjaxStore from './base-ajax-store';

export default class BlogListStore extends BaseAjaxStore {
  constructor(flux) {
    super('blogList');

    this.state = {};

    this.blogActions = flux.getActions('blog');

    this.registerAsync(this.blogActions.getBlogList, this.onLoading, this.onSuccess, this.onFailure);
  }

  getStateAsObject() {
    if (!this.state.blogList && this.getStatus() !== 'loading') {
      this.blogActions.getBlogList();
    }
    return this.state;
  }
}