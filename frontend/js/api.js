"use strict";

var request = require('./util/superagent-promise');
var props = require('./util/props');
var isServer = require('./util/is-server');

var API_BASE = isServer ? props.get('API_BASE') : props.get('AJAX_BASE');

exports.getBlog = function(blogId) {
  return request.get(API_BASE + 'blogs/' + blogId).end();
};

exports.getBlogList = function() {
  return request.get(API_BASE + 'blogs');
};

exports.getEntry = function(entryId) {
  return request.get(API_BASE + 'entries/' + entryId).end();
};

exports.login = function(emailAddress, password, rememberMe) {
  return request.post(API_BASE + 'login')
    .send({
      emailAddress: emailAddress,
      password: password,
      rememberMe: rememberMe
    })
    .end();
};