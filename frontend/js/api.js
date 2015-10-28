"use strict";

var request = require('./util/superagent-promise');
var props = require('./util/props');
var isServer = require('./util/is-server');

var API_BASE = isServer ? props.get('apiBase') : props.get('ajaxBase');

exports.getBlog = function (blogId) {
  return get('blogs/' + blogId, arguments);
};

exports.getBlogList = function () {
  return get('blogs', arguments);
};

exports.getEntry = function (entryId) {
  return get('entries/' + entryId, arguments);
};

exports.updateEntry = function (entry) {
  return post('entries/' + entry.entryId, arguments, entry);
};

exports.login = function (emailAddress, password) {
  return post('login', arguments, {
    emailAddress: emailAddress,
    password: password
  });
};

exports.getUserForSession = function (sessionId) {
  return get('users/withSession/' + sessionId, arguments);
};

exports.getCurrentUser = function () {
  return get('users/withSession', arguments);
};

exports.register = function (userDetails) {
  return post('register', arguments, userDetails);
};

exports.getUser = function(userId) {
  return get('users/' + userId, arguments);
};

function get(url, args) {
  return request.get(API_BASE + url).end().catch(onError.bind(null, url, args));
}

function post(url, args, data) {
  return request.post(API_BASE + url, args)
    .send(data)
    .end()
    .catch(onError.bind(null, url, args));
}

function onError(url, args, error) {
  error = error || new Error("Unknown cause");
  console.error('Failed for ' + url + ': ' + error);
  error.args = args;
  throw error;
}