module.exports = function(exts) {
  return new RegExp("\\.(" + exts.map(function(ext) {
    return ext.replace(/\./g, "\\.") + "(\\?.*)?";
  }).join("|") + ")$");
};