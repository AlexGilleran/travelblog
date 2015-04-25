var request = require('superagent');

exports.getBlog = function(blogId) {
  return new Promise(function(resolve, reject) {
    request.get(process.env.AJAX_BASE + 'blogs/' + blogId).end(function(err, res) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res.body);
      }
    });
  });
};

exports.getBlogList = function() {
  return new Promise(function(resolve, reject) {
    request.get(process.env.AJAX_BASE + 'blogs').end(function(err, res) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res.body);
      }
    });
  });
};