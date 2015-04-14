require('es6-promise').polyfill();
require("../../less/style.less");

var InjectionContext = require('../util/injection-context');
var React = require('react');
var Router = require('react-router');
var RoutesModule = require('../routes.jsx');
var rehydrator = require('./rehydrator');

React.initializeTouchEvents(true);
var injectionContext = new InjectionContext();

var initialStateElement = document.getElementById("initial-state");
if (initialStateElement) {
  rehydrator.init(initialStateElement);
} else {
  console.error("Couldn't find an element with id=initial-state. Continuing, but this will probably mean a react re-render");
}

var routes = injectionContext.injectNew(RoutesModule);
Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  // you might want to push the state of the router to a
  // store for whatever reason
  // NavActions.routeChange({routerState: state});
  React.render(React.createElement(Handler), document.getElementById("root"));
});