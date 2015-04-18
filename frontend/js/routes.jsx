var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RootViewModule = require('./components/root-view');
var BlogViewModule = require('./components/blog-view');

exports.constructor = function(ctx) {
  var RootView = ctx.injectNew(RootViewModule);
  var BlogView = ctx.injectNew(BlogViewModule);

  return (
    <Route name="app" path="/" handler={RootView}>
      <Route name="blogs" path="blogs/:blogId" handler={BlogView} />
      <DefaultRoute handler={BlogView}/>
      <NotFoundRoute handler={BlogView}/>
    </Route>
  );
};

exports.singletonKey = 'routes';