var request = require('superagent');
var API_BASE_URL = 'http://localhost:3000/api/';

exports.getBlog = function(blogId) {
  return new Promise(function(resolve, reject) {
    request.get(API_BASE_URL + 'blog/' + blogId).end(function(err, res) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res.body);
      }
    });
  });
};