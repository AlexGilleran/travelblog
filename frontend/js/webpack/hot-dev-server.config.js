module.exports = require("./make-webpack-config")({
  hot: true,
  devServer: true,
  hotComponents: true,
  devtool: "cheap-module-eval-source-map",
  debug: true,
});