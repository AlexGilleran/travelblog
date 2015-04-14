module.exports = function(stores) {
  var dehydratedStores = {};

  stores.forEach(function(store) {
    if (typeof store.hydrationKey !== 'string') {
      throw new Error("No hydration key for " + JSON.stringify(store));
    }

    if (typeof store.dehydrate !== 'function') {
      throw new Error("No dehydrate function for " + JSON.stringify(store));
    }

    dehydratedStores[store.hydrationKey] = store.dehydrate();
  });

  return JSON.stringify(dehydratedStores);
};