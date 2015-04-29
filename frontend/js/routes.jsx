var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RootViewModule = require('./components/root-view');
var BlogViewModule = require('./components/blog-view');
var HomeViewModule = require('./components/home-view');
var EntryViewModule = require('./components/entry-view');

exports.constructor = function(ctx) {
  var RootView = ctx.injectNew(RootViewModule);
  var BlogView = ctx.injectNew(BlogViewModule);
  var HomeView = ctx.injectNew(HomeViewModule);
  var EntryView = ctx.injectNew(EntryViewModule);

  return (
    <Route name="app" path="/" handler={RootView}>
      <Route name="blogs" path="blogs/:blogId" handler={BlogView} />
      <Route name="entries" path="entries/:entryId" handler={EntryView} />
      <DefaultRoute handler={HomeView}/>
      <NotFoundRoute handler={HomeView}/>
    </Route>
  );
};

exports.singletonKey = 'routes';