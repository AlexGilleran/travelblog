function combine(...funcs) {
  return (...args) => funcs.reduce((soFar, func) => soFar + '\n' + func.apply(null, args).join(''), '');
}

export {combine}