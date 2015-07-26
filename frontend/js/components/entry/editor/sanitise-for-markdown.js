const MARKDOWN_REGEX = new RegExp('\\*|\\||#|\\/|\\(|\\)|\\[|\\]|<|>|\\_');
const SPACE_REGEX = new RegExp('\\s');

export default function sanitiseForMarkdown(char) {
  if (SPACE_REGEX.test(char)) {
    return '&nbsp;';
  } else if (MARKDOWN_REGEX.test(char)) {
    return '\\' + char;
  } else {
    return char;
  }
}