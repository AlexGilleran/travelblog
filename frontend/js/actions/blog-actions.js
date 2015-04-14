var Reflux = require('reflux');
var api = require('../api');

exports.constructor = function(ctx) {
  var BlogActions = Reflux.createActions({
    'loadBlog': {
      children: ['success', 'failure']
    }
  });

  BlogActions.loadBlog.listen(function(blogId) {
    api.getBlog(blogId)
      .then(function(blog) {
        this.success(blogId, blog);
      }.bind(this))
      .catch(this.failure(blogId));
  });

  return BlogActions;
};

exports.singletonKey = 'blog-actions';