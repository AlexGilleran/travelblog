var request = require('superagent');
var props = require('./util/props');

exports.getBlog = function(blogId) {
  return new Promise(function(resolve, reject) {
    request.get(props.get('AJAX_BASE') + 'blogs/' + blogId).end(function(err, res) {
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
    request.get(props.get('AJAX_BASE') + 'blogs').end(function(err, res) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res.body);
      }
    });
  });
};