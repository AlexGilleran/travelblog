"use strict";

var request = require('./util/superagent-promise');
var props = require('./util/props');
var isServer = require('./util/is-server');

var API_BASE = isServer ? props.get('apiBase') : props.get('ajaxBase');

exports.getBlog = function(blogId) {
  return get(API_BASE + 'blogs/' + blogId);
};

exports.getBlogList = function() {
  return get(API_BASE + 'blogs');
};

exports.getEntry = function(entryId) {
  return get(API_BASE + 'entries/' + entryId);
};

exports.login = function(emailAddress, password) {
  return request.post(API_BASE + 'login')
    .send({
      emailAddress: emailAddress,
      password: password
    })
    .end();
};

exports.getUserForSession = function(sessionId) {
  return get(API_BASE + 'users/withSession/' + sessionId);
};

exports.getCurrentUser = function() {
  return get(API_BASE + 'users/withSession');
};

exports.register = function(userDetails) {
  return request.post(API_BASE + 'register')
    .send(userDetails)
    .end();
}

function get(url) {
  return request.get(url).end().catch(onGetError.bind(null, url));
}

function onGetError(url, error) {
  console.error('Failed to GET from ' + url + ': ' + error);
}