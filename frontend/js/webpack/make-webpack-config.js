var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var loadersByExtension = require("./loadersByExtension");
var joinEntry = require("./joinEntry");
var fs = require("fs");

module.exports = function (options) {
  var defaultEntry = {
    main: options.node ? ['babel-polyfill', './js/server/server.js'] : ['babel-polyfill', 'whatwg-fetch', './js/client/client']
  };
  var loaders = {
    "json": "json-loader",
    "js|jsx": {loader: "react-hot-loader!babel-loader?sourceMap=false", exclude: /node_modules/},
    "png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
    "woff": "url-loader?limit=100000",
    "ttf|eot": "file-loader",
    "html": "html-loader",
    "md|markdown": ["html-loader", "markdown-loader"]
  };
  var stylesheetLoaders = {
    "css": "css-loader",
    "less": "css-loader!less-loader",
    "styl": "css-loader!stylus-loader",
    "sass": "css-loader!sass-loader",
  };
  var additionalLoaders = [
    // { test: /some-reg-exp$/, loader: "any-loader" }
  ];
  var alias = {};
  var aliasLoader = {};
  var definePlugin = {};
  var externals = [];
  var modulesDirectories = ["web_modules", "node_modules"];
  var modulesDirectories = ["node_modules"];
  var extensions = ["", ".web.js", ".js", ".jsx"];
  var root = path.join(__dirname, "app");
  var publicPath = options.devServer ?
    "http://localhost:2992/_assets/" :
    "/dist/bundled/";
  var output = {
    path: path.join(__dirname, "../../build/webpack"),
    publicPath: publicPath,
    filename: options.node ? "backend.js" : "[name].js" + (options.longTermCaching && !options.node ? "?[chunkhash]" : ""),
    chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching && !options.node ? "?[chunkhash]" : ""),
    sourceMapFilename: "debugging/[file].map",
    // libraryTarget: options.node ? "commonjs2" : undefined,
    pathinfo: options.debug,
  };
  var plugins = [
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
    new webpack.IgnorePlugin(/config$/)
  ];
  if (options.node) {
    externals = fs.readdirSync('node_modules')
      .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
      })
      .reduce(function (nodeModules, mod) {
        nodeModules[mod] = 'commonjs ' + mod;
        return nodeModules;
      }, {});

    plugins.push(new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}));
    plugins.push(new webpack.IgnorePlugin(/\.(css|less)$/));
    plugins.push(new webpack.BannerPlugin('require("source-map-support").install();', {raw: true, entryOnly: false}));

    definePlugin['process.env.IS_SERVER'] = 'true';
  } else {
    definePlugin['process.env.IS_SERVER'] = 'false';
  }
  if (options.commonsChunk) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching && !options.node ? "?[chunkhash]" : "")));
  }

  Object.keys(stylesheetLoaders).forEach(function (ext) {
    var loaders = stylesheetLoaders[ext];
    if (Array.isArray(loaders)) loaders = loaders.join("!");
    if (options.node) {
      stylesheetLoaders[ext] = "null-loader";
    } else if (options.separateStylesheet) {
      stylesheetLoaders[ext] = ExtractTextPlugin.extract("style-loader", loaders);
    } else {
      stylesheetLoaders[ext] = "style-loader!" + loaders;
    }
  });
  if (options.separateStylesheet && !options.node) {
    plugins.push(new ExtractTextPlugin("[name].css"));
  }
  if (options.minimize) {
    definePlugin['process.env.NODE_ENV'] = JSON.stringify("production");

    plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  plugins.push(new webpack.DefinePlugin(definePlugin));

  return {
    entry: options.entry || defaultEntry,
    output: output,
    target: options.node ? "node" : "web",
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