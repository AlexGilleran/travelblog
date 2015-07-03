"use strict";

var request = require('./util/superagent-promise');
var props = require('./util/props');
var isServer = require('./util/is-server');

var API_BASE = isServer ? props.get('apiBase') : props.get('ajaxBase');

exports.getBlog = function(blogId) {
  return request.get(API_BASE + 'blogs/' + blogId).end();
};

exports.getBlogList = function() {
  return request.get(API_BASE + 'blogs').end();
};

exports.getEntry = function(entryId) {
  return request.get(API_BASE + 'entries/' + entryId).end();
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
  return request.get(API_BASE + 'users/withSession/' + sessionId).end();
};

exports.getCurrentUser = function() {
  return request.get(API_BASE + 'users/withSession').end();
};

exports.register = function(userDetails) {
  return request.post(API_BASE + 'register')
    .send(userDetails)
    .end();
}