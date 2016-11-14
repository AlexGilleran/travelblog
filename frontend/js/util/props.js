"use strict";

var reduce = require('lodash/collection/reduce');

var CLIENT_ENV_VAR_WHITELIST = [
  'staticAssetBase',
  'jsBundleName',
  'cssBundleName',
  'ajaxBase'
];

if (process.env.IS_SERVER) {
  console.log('Server!');
  var config = require('config/lib/config.js');
  exports.get = key => config.get(key);
} else {
  console.log('Client!');
  const props = JSON.parse(document.getElementById('props').innerHTML);
  exports.get = key => props[key];
}

exports.getForClient = function () {
  return reduce(CLIENT_ENV_VAR_WHITELIST, function (acc, key) {
    acc[key] = config.get(key);
    return acc;
  }, {});
};