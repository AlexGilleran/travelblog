import {Actions} from 'flummox';
import api from '../api';
import actionUtils from './action-utils';

export default class BlogActions extends Actions {
  async getBlog(blogId) {
    const blog = await actionUtils.catchArguments(api.getBlog, blogId);
    blog.id = blogId;
    return blog;
  }

  async getBlogList() {
    return await api.getBlogList();
  }
}