var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var loadersByExtension = require("./loadersByExtension");
var joinEntry = require("./joinEntry");

module.exports = function (options) {
  var defaultEntry = {
    main: ['babel-polyfill', 'whatwg-fetch', './js/client/client']
  };
  var loaders = {
    "json": "json-loader",
    "js|jsx": {loader: "react-hot-loader!babel-loader?sourceMap=false", exclude: /node_modules/},
    "json5": "json5-loader",
    "txt": "raw-loader",
    "png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
    "woff": "url-loader?limit=100000",
    "ttf|eot": "file-loader",
    "wav|mp3": "file-loader",
    "html": "html-loader",
    "md|markdown": ["html-loader", "markdown-loader"]
  };
  var stylesheetLoaders = {
    "css": "css-loader",
    "less": "css-loader!less-loader",
    "styl": "css-loader!stylus-loader",
    "sass": "css-loader!sass-loader",
  }
  var additionalLoaders = [
    // { test: /some-reg-exp$/, loader: "any-loader" }
  ];
  var alias = {};
  var aliasLoader = {};
  var externals = [];
  var modulesDirectories = ["web_modules", "node_modules"];
  var extensions = ["", ".web.js", ".js", ".jsx"];
  var root = path.join(__dirname, "app");
  var publicPath = options.devServer ?
    "http://localhost:2992/_assets/" :
    "/dist/bundled/";
  var output = {
    path: path.join(__dirname, "../../build/webpack"),
    publicPath: publicPath,
    filename: "[name].js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
    chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
    sourceMapFilename: "debugging/[file].map",
    libraryTarget: options.prerender ? "commonjs2" : undefined,
    pathinfo: options.debug,
  };
  var plugins = [
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
    new webpack.IgnorePlugin(/config$/)
  ];
  if (options.prerender) {
    aliasLoader["react-proxy$"] = "react-proxy/unavailable";
    externals.push(
      /^react(\/.*)?$/,
      /^reflux(\/.*)?$/,
      "superagent",
      "async"
    );
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}));
  }
  if (options.commonsChunk) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : "")));
  }

  Object.keys(stylesheetLoaders).forEach(function (ext) {
    var loaders = stylesheetLoaders[ext];
    if (Array.isArray(loaders)) loaders = loaders.join("!");
    if (options.prerender) {
      stylesheetLoaders[ext] = "null-loader";
    } else if (options.separateStylesheet) {
      stylesheetLoaders[ext] = ExtractTextPlugin.extract("style-loader", loaders);
    } else {
      stylesheetLoaders[ext] = "style-loader!" + loaders;
    }
  });
  if (options.separateStylesheet && !options.prerender) {
    plugins.push(new ExtractTextPlugin("[name].css"));
  }
  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }),
      new webpack.NoErrorsPlugin()
    );
  }

  return {
    entry: options.entry || defaultEntry,
    output: output,
    target: options.prerender ? "node" : "web",
    module: {
      loaders: loadersByExtension(loaders).concat(loadersByExtension(stylesheetLoaders))
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, "node_modules"),
      alias: aliasLoader
    },
    externals: externals,
    resolve: {
      root: root,
      modulesDirectories: modulesDirectories,
      extensions: extensions,
      alias: alias,
    },
    plugins: plugins,
    devServer: {
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    }
  };
};