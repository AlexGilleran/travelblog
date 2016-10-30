require("../../less/style.less");

import IsomorphicRelay from 'isomorphic-relay';
import isoRelayRouter from 'isomorphic-relay-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, match, Router, applyRouterMiddleware } from 'react-router';
import routes from '../routes.jsx';
import Relay from 'react-relay';

const environment = new Relay.Environment();

environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/api/graphql', {
  credentials: 'same-origin'
}));

const data = JSON.parse(document.getElementById('preloadedData').textContent);

IsomorphicRelay.injectPreparedData(environment, data);

const rootElement = document.getElementById('root');

// use the same routes object as on the server
match({routes, history: browserHistory}, (error, redirectLocation, renderProps) => {
  isoRelayRouter.prepareInitialRender(environment, renderProps).then(props => {
    ReactDOM.render(<Router {...props} render={applyRouterMiddleware(isoRelayRouter.useIsoRelay)} />, rootElement);
  });
});
