module.exports = [
  require("./make-webpack-config")({
    // commonsChunk: true,
    longTermCaching: true,
    separateStylesheet: true,
    minimize: false,
    devtool: "source-map",
  }),
  // require("./make-webpack-config")({
  //   prerender: true,
  // })
];