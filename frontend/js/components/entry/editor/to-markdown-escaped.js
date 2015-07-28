import toMarkdown from 'to-markdown';

const MARKDOWN_REGEX = new RegExp('\\*|\\||#|\\(|\\)|\\[|\\]|\\_', 'g');

export default function toMarkdownEscaped(html, options) {
  return toMarkdown(html.replace(MARKDOWN_REGEX, '\\$&'), options);
}