export async function catchArguments() {
  var fn = arguments[0];
  var args = Array.slice(arguments, 1);

  try {
    return await fn.apply(this, args);
  } catch(e) {
    e.arguments = arguments;
    throw e;
  }
}