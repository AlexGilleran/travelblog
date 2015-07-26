import find from 'lodash/collection/find';

const substitutionMappings = {
  " ": ['&nbsp;', String.fromCharCode(160)],
}
substitutionMappings[String.fromCharCode(160)] = [" ", '&nbsp;'];

/**
 * Maps the end of the text to its index in the markdown
 */
export default function mapMarkdownIndex(text, markdown) {
  var textIndex = 0, markdownIndex = 0;

  while (textIndex < text.length) {
    if (markdownIndex >= markdown.length) {
      throw new Error('Broke in diff');
    }

    const toAdvance = getCharNumberToAdvance(text.substring(textIndex, textIndex + 1), markdown, markdownIndex);
    textIndex += toAdvance[0];
    markdownIndex += toAdvance[1];
  }

  return markdownIndex;
}

/**
 * Gets how many chars to go ahead - returns a tuple where the first value is how many chars to advance in text,
 * and the second is how many to advance in markdown.
 */
function getCharNumberToAdvance(textChar, markdown, markdownIndex) {
  if (textChar === markdown.substring(markdownIndex, markdownIndex + 1)) {
    return [1, 1];
  }

  if (!substitutionMappings[textChar]) {
    return [0, 1];
  }

  const correctSubstitution = find(substitutionMappings[textChar], substitution =>
    substitution === markdown.substring(markdownIndex, markdownIndex + substitution.length)
  );

  return correctSubstitution ? [1, correctSubstitution.length] : [0, 1];
}