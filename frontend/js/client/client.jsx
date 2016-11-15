require("../../less/style.less");

import IsomorphicRelay from 'isomorphic-relay';
import isoRelayRouter from 'isomorphic-relay-router';
import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, match, Router, applyRouterMiddleware} from 'react-router';
import Relay from 'react-relay';

const environment = new Relay.Environment();

environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/api/graphql', {
  credentials: 'same-origin'
}));

const data = JSON.parse(document.getElementById('preloadedData').textContent);

IsomorphicRelay.injectPreparedData(environment, data);

const rootElement = document.getElementById('root');

class App extends React.Component {
  render() {
    return this.props.children;
  }
}

// use the same routes object as on the server
function render() {
  const routes = require('../routes').default;

  match({routes, history: browserHistory}, (error, redirectLocation, renderProps) => {
    isoRelayRouter.prepareInitialRender(environment, renderProps).then(props => {
      const newProps = {render: applyRouterMiddleware(isoRelayRouter.useIsoRelay), ...props};

      ReactDOM.render(
        <App>
          <Router {...newProps} />
        </App>
        , rootElement);

    });
  });
}

render();

if (module.hot) {
  module.hot.accept('../routes', () => {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(rootElement);
      render();
    });
  });
}