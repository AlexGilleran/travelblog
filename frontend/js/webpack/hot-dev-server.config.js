module.exports = require("./make-webpack-config")({
  hot: true,
  devServer: true,
  hotComponents: true,
  devtool: "cheap-source-map",
  debug: true,
});