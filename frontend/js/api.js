"use strict";

var request = require('./util/superagent-promise');
var props = require('./util/props');
var isServer = require('./util/is-server');

var API_BASE = isServer ? props.get('apiBase') : props.get('ajaxBase');

exports.getBlog = function (blogId) {
  return get('blogs/' + blogId);
};

exports.getBlogList = function () {
  return get('blogs');
};

exports.getEntry = function (entryId) {
  return get('entries/' + entryId);
};

exports.updateEntry = function (entry) {
  return post('entries/' + entry.entryId, entry);
};

exports.login = function (emailAddress, password) {
  return post('login', {
    emailAddress: emailAddress,
    password: password
  });
};

exports.getUserForSession = function (sessionId) {
  return get('users/withSession/' + sessionId);
};

exports.getCurrentUser = function () {
  return get('users/withSession');
};

exports.register = function (userDetails) {
  return request.post(API_BASE + 'register')
    .send(userDetails)
    .end();
}

function get(url) {
  return request.get(API_BASE + url).end().catch(onError.bind(null, url));
}

function post(url, data) {
  return request.post(API_BASE + url)
    .send(data)
    .end()
    .catch(onError.bind(null, url));
}

function onError(url, error) {
  console.error('Failed for ' + url + ': ' + error);
  throw error;
}