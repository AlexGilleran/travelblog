module.exports = function parse(formatters, md, outerInBlock = false) {
  if (!formatters.length) {
    return [md, false];
  }

  const formatter = formatters[0];
  const restOfFormatters = formatters.slice(1);

  const splitMd = splitWithEscaping(md, formatter.symbol, '\\');

  let innerInBlock = false;
  return [splitMd.map(function (block, index) {
    const lastSplit = index < splitMd.length - 1;
    const [inner, _inBlock] = parse(restOfFormatters, block, innerInBlock);
    innerInBlock = _inBlock;

    const val = outerInBlock ? formatter.wrap(inner) : inner;
    outerInBlock = lastSplit ? !outerInBlock : outerInBlock;

    return val;
  }), outerInBlock];
};

function splitWithEscaping(string, char, escapeChar) {
  const acc = [[]];

  for (let i = 0; i < string.length; i++) {
    const thisChar = string.charAt(i);
    const lastChar = i > 0 ? string.charAt(i - 1) : undefined;

    if (thisChar === char && lastChar !== escapeChar) {
      acc.push([]);
    } else {
      if (thisChar === char) {
        acc[acc.length - 1].pop();
      }

      acc[acc.length - 1].push(thisChar);
    }
  }

  return acc.map(arr => arr.join(''));
}