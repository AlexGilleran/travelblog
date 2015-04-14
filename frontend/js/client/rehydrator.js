var stores = {};

exports.init = function(jsonElement) {
  if (jsonElement.innerHTML) {
    stores = JSON.parse(jsonElement.innerHTML);
  }
};

exports.get = function(key) {
  return stores[key];
};