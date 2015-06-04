import {Actions} from 'flummox';
import api from '../api';
import {catchArguments} from './action-utils';

export default class BlogActions extends Actions {
  async getBlog(blogId) {
    const blog = await catchArguments(api.getBlog, blogId);
    blog.id = blogId;
    return blog;
  }

  async getBlogList() {
    return await api.getBlogList();
  }
}