module.exports = require("./make-webpack-config")({
  devServer: true,
  devtool: "source-map",
  debug: true,
  entry: {
    test: './test/test-entry'
  }
});