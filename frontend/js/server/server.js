'use strict';
Error.stackTraceLimit = Infinity;

require('./server-url-loader').install();

var serverTransformer = require('jsx-control-statements/server-transformer');
require('node-jsx').install({
  extension: '.jsx',
  additionalTransform: serverTransformer
});

var logger = require('koa-logger');
var koa = require('koa');
var koaStatic = require('koa-static');
var debug = require('debug')('server');
var preloadRouter = require('./preload-router');
var RoutesModule = require('../routes.jsx');
var InjectionContext = require('../util/injection-context');
var views = require('koa-render');
var co = require('co');
var props = require('../util/props');

var ReactRouter = require('react-router');
var React = require('react');
var dehydrator = require('./dehydrator');
var proxy = require('koa-proxy');

var app = koa();

app.use(logger());

app.use(function * (next) {
  var index = this.req.url.indexOf('/api/');

  if (index >= 0) {
    console.log('proxying to ' + props.get('API_BASE') + this.req.url.substr(index + '/api/'.length));
    yield proxy({
      url: props.get('API_BASE') + this.req.url.substr(index + '/api/'.length)
    }).call(this, next);
  } else {
    console.log('not proxying');
    yield next;
  }
});

app.use(koaStatic('.'));

// Add an injection context to the request.
app.use(function * (next) {
  this.injectionContext = new InjectionContext();
  yield next;
});

app.use(views('templates'));

// React router running isomorphically in node (zomg!)
app.use(function * (next) {
  var self = this;
  var routes = this.injectionContext.injectSingleton(RoutesModule);

  var content = yield new Promise(function (resolve, reject) {
    ReactRouter.run(routes, self.req.url, function (Handler, nextState) {
      co(function* (resolve, reject) {
        for (var i = 0; i < nextState.routes.length; i++) {
          var path = nextState.routes[i].path;

          if (preloadRouter[path]) {
            yield preloadRouter[path].call(self, nextState);
          }
        }
      }).then(afterPreload, onPreloadError);

      function afterPreload() {
        var handler = React.createElement(Handler);
        try {
          resolve(React.renderToString(handler));
        } catch (e) {
          reject(e);
        }
      }

      function onPreloadError(err) {
        reject(err);
      }
    });
  });

  var dehydratedStores = dehydrator(this.injectionContext.getStores());

  var templateInput = {
    content: content,
    initialState: dehydratedStores,
    cssBundle: props.get('CSS_BUNDLE_NAME') ? props.get('STATIC_ASSET_BASE') + props.get('CSS_BUNDLE_NAME') : null,
    jsBundle: props.get('STATIC_ASSET_BASE') + props.get('JS_BUNDLE_NAME'),
    props: JSON.stringify(props.getForClient())
  };

  self.body = yield self.render('index.whiskers', templateInput);
});

app.listen(props.get('PORT'));

// RING A DING DING DING DING
console.log('*splutter* *splutter* *vroooooom* on port ' + props.get('PORT'));