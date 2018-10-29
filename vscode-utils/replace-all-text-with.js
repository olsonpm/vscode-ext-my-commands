const { Position, Range } = require('vscode')

const replaceAllTextWith = str => textEditor =>
  textEditor.edit(editBuilder => {
    const { document } = textEditor,
      lastLineIdx = Math.max(document.lineCount - 1, 0),
      lastLine = document.lineAt(lastLineIdx),
      lastCharIdx = Math.max(lastLine.length - 1, 0),
      docStart = new Position(0, 0),
      docEnd = new Position(lastLineIdx, lastCharIdx),
      docRange = new Range(docStart, docEnd)

    editBuilder.replace(docRange, str)
  })

module.exports = replaceAllTextWith
