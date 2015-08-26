

export function serialiseSelection(containerEl) {
  var range = window.getSelection().getRangeAt(0);
  var preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(containerEl);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const preSelectionRangeText = preSelectionRange.toString();
  var start = preSelectionRangeText.length;

  return {
    start: start,
    end: start + range.toString().length
  };
};

export function restoreSelection(containerEl, serialisedSelection) {
  var charIndex = 0, range = document.createRange();
  range.setStart(containerEl, 0);
  range.collapse(true);
  var nodeStack = [containerEl], node, foundStart = false, stop = false;

  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType == 3) {
      var nextCharIndex = charIndex + node.length;
      if (!foundStart && serialisedSelection.start >= charIndex && serialisedSelection.start <= nextCharIndex) {
        range.setStart(node, serialisedSelection.start - charIndex);
        foundStart = true;
      }
      if (foundStart && serialisedSelection.end >= charIndex && serialisedSelection.end <= nextCharIndex) {
        range.setEnd(node, serialisedSelection.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else {
      var i = node.childNodes.length;
      while (i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }
  }

  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}