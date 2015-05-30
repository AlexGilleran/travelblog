'use strict';
Error.stackTraceLimit = Infinity;

require('./server-url-loader').install();
require("babel/register");

var logger = require('koa-logger');
var koa = require('koa');
var koaStatic = require('koa-static');
var debug = require('debug')('server');
var preloadRouter = require('./preload-router');
var routes = require('../routes.jsx');
var views = require('koa-render');
var co = require('co');
var props = require('../util/props');

var ReactRouter = require('react-router');
var React = require('react');
var proxy = require('koa-proxy');
var Flux = require('../flux');

var app = koa();

app.use(logger());

// Proxy API calls
app.use(function * (next) {
  var index = this.req.url.indexOf('/api/');

  if (index >= 0) {
    delete this.req.headers.host; // confuses heroku if not removed.
    yield proxy({
      url: props.get('API_BASE') + this.req.url.substr(index + '/api/'.length)
    }).call(this, next);
  } else {
    yield next;
  }
});

app.use(koaStatic('.'));

// Add an injection context to the request.
app.use(function * (next) {
  this.flux = new Flux();
  yield next;
});

app.use(views('templates'));

// React router running isomorphically
app.use(function * (next) {
  var self = this;

  var content = yield new Promise(function (resolve, reject) {
    ReactRouter.run(routes, self.req.url, function (Handler, nextState) {
      co(function* (resolve, reject) {
        var preloadYields = [];

        for (var i = 0; i < nextState.routes.length; i++) {
          var path = nextState.routes[i].path;

          if (preloadRouter[path]) {
            preloadYields.push(preloadRouter[path].call(self, nextState));
          }
        }

        yield preloadYields;
      }).then(function() {
        var handler = React.createElement(Handler, {flux: self.flux});
        try {
          resolve(React.renderToString(handler));
        } catch (e) {
          reject(e);
        }
      }).catch(function onPreloadError(err) {
        reject(err);
      });
    });
  });

  var dehydratedStores = this.flux.serialize();

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