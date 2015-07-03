"use strict";

var isServer = require('./is-server');
var reduce = require('lodash/collection/reduce');
var config = require('config');

var CLIENT_ENV_VAR_WHITELIST = [
  'staticAssetBase',
  'jsBundleName',
  'cssBundleName',
  'ajaxBase'
];

if (isServer) {
  exports.get = key => config.get(key);
} else {
  const props = JSON.parse(document.getElementById('props').innerHTML);
  exports.get = key => props[key];
}

exports.getForClient = function () {
  return reduce(CLIENT_ENV_VAR_WHITELIST, function (acc, key) {
    acc[key] = config.get(key);
    return acc;
  }, {});
};