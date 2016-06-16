'use strict';
Error.stackTraceLimit = Infinity;

require('./server-url-loader').install();

var logger = require('koa-logger');
var koa = require('koa');
var koaStatic = require('koa-static');
var debug = require('debug')('server');
var routes = require('../routes.jsx');
var views = require('koa-render');
var co = require('co');
var props = require('../util/props');

var ReactRouter = require('react-router');
var React = require('react');
var proxy = require('koa-proxy');
import IsomorphicRouter from 'isomorphic-relay-router';
import Relay from 'react-relay';

var app = koa();

app.use(logger());

// Proxy API calls
app.use(function *(next) {
  var index = this.req.url.indexOf('/api/');

  if (index >= 0) {
    //delete this.req.headers.host; // confuses heroku if not removed.
    yield proxy({
      url: props.get('apiBase') + this.req.url.substr(index + '/api/'.length)
    }).call(this, next);
  } else {
    yield next;
  }
});

app.use(koaStatic('.'));


app.use(views('templates'));

const GRAPHQL_URL = `http://localhost:8080/graphql`;

const networkLayer = new Relay.DefaultNetworkLayer(GRAPHQL_URL);

app.use(function *(next) {
  const req = this.req;
  const res = this.res;

  const {error, redirectLocation, renderProps} = yield new Promise((resolve, reject) => {
    match({routes, location: req.originalUrl}, (error, redirectLocation, renderProps) => {
      resolve({error, redirectLocation, renderProps});
    });
  });

  if (error) {
    next(error);
  } else if (redirectLocation) {
    res.redirect(302, redirectLocation.pathname + redirectLocation.search);
  } else if (renderProps) {
    yield IsomorphicRouter.prepareData(renderProps, networkLayer);
    const reactOutput = ReactDOMServer.renderToString(IsomorphicRouter.render(props));

    var templateInput = {
      content: reactOutput,
      cssBundle: props.get('cssBundleName') ? props.get('staticAssetBase') + props.get('cssBundleName') : null,
      jsBundle: props.get('staticAssetBase') + props.get('jsBundleName'),
      props: JSON.stringify(props.getForClient())
    };

    this.body = yield this.render('index.whiskers', templateInput);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(props.get('port'));

// RING A DING DING DING DING
console.log('*splutter* *splutter* *vroooooom* on port ' + props.get('port') + ' with env ' + process.env.NODE_ENV);