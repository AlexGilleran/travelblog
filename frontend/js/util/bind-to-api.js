/**
 * Helper to bind single-input/single-output actions to a function.
 */
module.exports = function (apiFunc) {
  return function (input) {
    apiFunc(input)
      .then(function (output) {
        this.completed(output);
      }.bind(this))
      .catch(function (err) {
        this.failed(err)
      }.bind(this));
  };
};