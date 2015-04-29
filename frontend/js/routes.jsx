var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RootViewModule = require('./components/root-view');
var BlogViewModule = require('./components/blog-view');
var HomeViewModule = require('./components/home-view');

exports.constructor = function(ctx) {
  var RootView = ctx.injectNew(RootViewModule);
  var BlogView = ctx.injectNew(BlogViewModule);
  var HomeView = ctx.injectNew(HomeViewModule);

  return (
    <Route name="app" path="/" handler={RootView}>
      <Route name="blogs" path="blogs/:blogId" handler={BlogView} />
      <DefaultRoute handler={HomeView}/>
      <NotFoundRoute handler={HomeView}/>
    </Route>
  );
};

exports.singletonKey = 'routes';