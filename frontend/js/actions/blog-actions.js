var Reflux = require('reflux');
var api = require('../api');

exports.constructor = function(ctx) {
  var BlogActions = Reflux.createActions({
    'loadBlog': {
      asyncResult: true
    }
  });

  BlogActions.loadBlog.listen(function(blogId) {
    api.getBlog(blogId)
      .then(function(blog) {
        this.completed(blogId, blog);
      }.bind(this))
      .catch(function(err) {
        this.failed(err, blogId)
      });
  });

  return BlogActions;
};

exports.singletonKey = 'blog-actions';