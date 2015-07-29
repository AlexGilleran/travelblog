const React = require('react');

module.exports = [
  {
    symbol: '_',
    wrap: toWrap => (<em>{toWrap}</em>)
  }, {
    symbol: '*',
    wrap: toWrap => (<strong>{toWrap}</strong>)
  }
];