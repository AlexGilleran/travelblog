var request = require('superagent');
var props = require('./util/props');
var isServer = require('./util/is-server');

var API_BASE = isServer ? props.get('API_BASE') : props.get('AJAX_BASE');

exports.getBlog = function(blogId) {
  return new Promise(function(resolve, reject) {
    request.get(API_BASE + 'blogs/' + blogId).end(function(err, res) {
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
    request.get(API_BASE + 'blogs').end(function(err, res) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res.body);
      }
    });
  });
};