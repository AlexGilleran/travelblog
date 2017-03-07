var hotConfig = require('./hot-dev-server.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');

hotConfig.plugins.push(
  new HtmlWebpackPlugin()
);

hotConfig.entry = ['babel-polyfill', './js/components/preview/entry'];

module.exports = hotConfig;