"use strict";

var isServer = require('./is-server');
var _ = require('lodash');

var CLIENT_ENV_VAR_WHITELIST = [
  'STATIC_ASSET_BASE',
  'JS_BUNDLE_NAME',
  'CSS_BUNDLE_NAME',
  'AJAX_BASE'
];

var props;
if (isServer) {
  props = process.env;
} else {
  props = JSON.parse(document.getElementById('props').innerHTML);
}

exports.get = function(key) {
  return props[key];
};

exports.getForClient = function() {
  return _.pick(props, CLIENT_ENV_VAR_WHITELIST);
};