var Reflux = require('reflux');
var api = require('../api');
var bindToApi = require('../util/bind-to-api');

exports.constructor = function (ctx) {
  var BlogActions = Reflux.createActions({
    'loadBlog': {asyncResult: true},
    'loadBlogList': {asyncResult: true}
  });

  BlogActions.loadBlog.listen(function (blogId) {
    api.getBlog(blogId)
      .then(function (blog) {
        this.completed(blogId, blog);
      }.bind(this))
      .catch(function (err) {
        this.failed(err, blogId)
      }.bind(this));
  });

  BlogActions.loadBlogList.listen(bindToApi(api.getBlogList));

  return BlogActions;
};

exports.singletonKey = 'blog-actions';