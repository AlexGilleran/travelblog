"use strict";

var request = require('superagent');
var props = require('./util/props');
var isServer = require('./util/is-server');

var API_BASE = isServer ? props.get('API_BASE') : props.get('AJAX_BASE');

exports.getBlog = function(blogId) {
  return get('blogs/' + blogId);
};

exports.getBlogList = function() {
  return get('blogs');
};

exports.getEntry = function(entryId) {
  return get('entries/' + entryId);
};

function get(path) {
  return new Promise(function(resolve, reject) {
    request.get(API_BASE + path).end(function(err, res) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res.body);
      }
    });
  });
}