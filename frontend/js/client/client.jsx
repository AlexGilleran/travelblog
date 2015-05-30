require("../../less/style.less");
require("babel/polyfill");

var React = require('react');
var Router = require('react-router');
var routes = require('../routes.jsx');
var Flux = require('../flux');

var flux = new Flux();

var initialStateElement = document.getElementById("initial-state");
if (initialStateElement) {
  flux.deserialize(initialStateElement.innerHTML);
} else {
  console.error("Couldn't find an element with id=initial-state. Continuing, but this will probably mean a react re-render");
}

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler flux={flux} />, document.getElementById("root"));
});