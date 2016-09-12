'use strict';
Error.stackTraceLimit = Infinity;

require('./server-url-loader').install();

var logger = require('koa-logger');
var koa = require('koa');
var koaStatic = require('koa-static');
var debug = require('debug')('server');
var views = require('koa-render');
var co = require('co');
var props = require('../util/props');

var ReactRouter = require('react-router');
var React = require('react');
var proxy = require('koa-proxy');
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import IsomorphicRouter from 'isomorphic-relay-router';
import Relay from 'react-relay';
import url from 'url';
import routes from '../routes.jsx';

var app = koa();

app.use(logger());

// Proxy API calls
app.use(function *(next) {
  var index = this.req.url.indexOf('/graphql');

  if (index >= 0) {
    yield proxy({
      url: 'http://api:8081/graphql'
    }).call(this, next);
  } else {
    yield next;
  }
});

app.use(koaStatic('.'));


app.use(views('templates'));

const GRAPHQL_URL = `http://api:8081/graphql`;

const networkLayer = new Relay.DefaultNetworkLayer(GRAPHQL_URL);

app.use(function *(next) {
  const req = this.req;
  const res = this.res;

  const {error, redirectLocation, renderProps} = yield new Promise((resolve, reject) => {
    const urlParts = url.parse(req.url);
    match({routes, location: urlParts.pathname}, (error, redirectLocation, renderProps) => {
      resolve({error, redirectLocation, renderProps});
    });
  });

  if (error) {
    res.status = 500;
    console.error(error);
    res.body = error;
  } else if (redirectLocation) {
    res.redirect(302, redirectLocation.pathname + redirectLocation.search);
  } else if (renderProps) {
    const {data, props: reactProps} = yield IsomorphicRouter.prepareData(renderProps, networkLayer);
    const reactOutput = renderToString(IsomorphicRouter.render(reactProps));

    console.log(data);

    var templateInput = {
      content: reactOutput,
      preloadedData: JSON.stringify(data),
      cssBundle: props.get('cssBundleName') ? props.get('staticAssetBase') + props.get('cssBundleName') : null,
      jsBundle: props.get('staticAssetBase') + props.get('jsBundleName'),
      props: JSON.stringify(props.getForClient())
    };

    this.body = yield this.render('index.whiskers', templateInput);
  } else {
    res.status = 404;
    this.body = 'Not found';
  }
});

app.listen(props.get('port'));

// RING A DING DING DING DING
console.log('*splutter* *splutter* *vroooooom* on port ' + props.get('port') + ' with env ' + process.env.NODE_ENV);