import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import normalize from 'normalize-css';

document.body.innerHTML = '<div id="root"></div>';
const rootElement = document.getElementById('root');

// use the same routes object as on the server
function render() {
  ReactDOM.render(
    <Root />
    , rootElement);
}

render();

if (module.hot) {
  module.hot.accept('./preview', () => {
    ReactDOM.unmountComponentAtNode(rootElement);
    render();
  });
}