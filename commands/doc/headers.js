const tedent = require('tedent'),
  vscode = require('vscode')

const { map, passThrough, repeatStr, toArrayOfValues } = require('../../utils')

const variantToText = {
  export: 'Exports',
  helper: 'Helper Functions',
  import: 'Imports',
  init: 'Init',
  main: 'Main',
}

const init = () =>
  passThrough(variantToText, [map(toCommandResult), toArrayOfValues])

function toCommandResult(text, variant) {
  return vscode.commands.registerTextEditorCommand(
    `personal.doc-${variant}`,
    makeCommandCb(text, variant)
  )
}

function makeCommandCb(text, variant) {
  const header = createHeader(text, variant)

  return textEditor => {
    const cursorPos = textEditor.selection.active
    return textEditor.edit(editBuilder => editBuilder.insert(cursorPos, header))
  }
}

function createHeader(text, variant) {
  const border = repeatStr(text.length + 2)('-')

  let header = tedent(`
    //${border}//
    // ${text} //
    //${border}//
  `)

  if (variant !== 'import') {
    header = '//\n' + header
  }

  return header + '\n'
}

module.exports = { init }
