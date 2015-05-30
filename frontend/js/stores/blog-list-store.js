import BaseAjaxStore from './base-ajax-store';

export default class BlogListStore extends BaseAjaxStore {
  constructor(flux) {
    super();

    this.state = {};

    this.blogActions = flux.getActions('blog');

    this.registerAsync(this.blogActions.getBlogList, this.onLoading, this.onSuccess.bind(this, 'blogList'), this.onFailure);
  }

  getStateAsObject() {
    if (!this.state.blogList && !this.state.loading) {
      this.blogActions.getBlogList();
    }
    return this.state;
  }
}