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
      url: props.get('apiBase') + this.req.url.substr(index + '/api/'.length)
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
      var preloadActions = [];

      for (var i = 0; i < nextState.routes.length; i++) {
        var path = nextState.routes[i].path;

        if (preloadRouter[path]) {
          preloadActions = preloadActions.concat(preloadRouter[path].call(self, nextState));
        }
      }

      Promise.all(preloadActions)
        .then(function () {
          var handler = React.createElement(Handler, {flux: self.flux, routerState: nextState});

          resolve(React.renderToString(handler));
        }).catch(function (err) {
          reject(err);
        });
    });
  });

  var dehydratedStores = this.flux.serialize();

  var templateInput = {
    content: content,
    initialState: dehydratedStores,
    cssBundle: props.get('cssBundleName') ? props.get('staticAssetBase') + props.get('cssBundleName') : null,
    jsBundle: props.get('staticAssetBase') + props.get('jsBundleName'),
    props: JSON.stringify(props.getForClient())
  };

  self.body = yield self.render('index.whiskers', templateInput);
});

app.listen(props.get('port'));

// RING A DING DING DING DING
console.log('*splutter* *splutter* *vroooooom* on port ' + props.get('port') + ' with env ' + process.env.NODE_ENV);