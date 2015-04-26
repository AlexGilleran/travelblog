var extensions = 'png|jpg|jpeg|gif|svg'.split('|');
var path = require('path');
var _ = require('lodash');
var props = require('../util/props');
var fs = require('fs');

// TODO: Share config with webpack
var limit = 10000;
var urlLoader = require('url-loader');

exports.install = function() {
  extensions.forEach(function(ext) {
    require.extensions['.' + ext] = function(module, filename) {
      var content = fs.readFileSync(filename);
      // var url = loaderUtils.interpolateName({resourcePath: filename}, "[hash].[ext]", {
      //   content: 
      // });

      // return module._compile('module.exports = \'' + process.env.STATIC_ASSET_BASE + filePath + '\';', filename);

      return module._compile(urlLoader.call({
        options: {
          limit: limit
        },
        resourcePath: filename
      }, content).replace('__webpack_public_path__', props.get('STATIC_ASSET_BASE')), filename);
    };
  });
};