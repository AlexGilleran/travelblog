module.exports = require("./make-webpack-config")({
  hot: false,
  devServer: true,
  hotComponents: false,
  devtool: "source-map",
  node: true
});