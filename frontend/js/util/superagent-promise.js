var superagent = require('superagent');

/**
 * Request object similar to superagent.Request, but with end() returning
 * a promise.
 */
function PromiseRequest() {
  superagent.Request.apply(this, arguments);
}

// Inherit form superagent.Request
PromiseRequest.prototype = Object.create(superagent.Request.prototype);

/** Send request and get a promise that `end` was emitted */
PromiseRequest.prototype.end = function (cb) {
  return convertToPromise.call(this, cb);
};

/** Provide a more promise-y interface */
PromiseRequest.prototype.then = function (resolve, reject) {
  return convertToPromise.call(this).then(resolve, reject);
};

function convertToPromise(cb) {
  return new Promise(function (accept, reject) {
    superagent.Request.prototype.end.call(this, function (err, response) {
      if (cb) {
        cb(err, response.body);
      }

      // TODO: parse error from API if available.
      if (!response) {
        reject(new Error('No response'));
      } else if (response.error) {
        reject(response.error);
      } else {
        accept(response.body);
      }
    });
  }.bind(this))
}

/**
 * Request builder with same interface as superagent.
 * It is convenient to import this as `request` in place of superagent.
 */
var request = function (method, url) {
  return new PromiseRequest(method, url);
};

/** Helper for making an options request */
request.options = function (url) {
  return request('OPTIONS', url);
}

/** Helper for making a head request */
request.head = function (url, data) {
  var req = request('HEAD', url);
  if (data) {
    req.send(data);
  }
  return req;
};

/** Helper for making a get request */
request.get = function (url, data) {
  var req = request('GET', url);
  if (data) {
    req.query(data);
  }
  return req;
};

/** Helper for making a post request */
request.post = function (url, data) {
  var req = request('POST', url);
  if (data) {
    req.send(data);
  }
  return req;
};

/** Helper for making a put request */
request.put = function (url, data) {
  var req = request('PUT', url);
  if (data) {
    req.send(data);
  }
  return req;
};

/** Helper for making a patch request */
request.patch = function (url, data) {
  var req = request('PATCH', url);
  if (data) {
    req.send(data);
  }
  return req;
};

/** Helper for making a delete request */
request.del = function (url) {
  return request('DELETE', url);
};


module.exports = request;