const camelcase = require('camelcase'),
  _fs = require('fs'),
  path = require('path'),
  pify = require('pify'),
  tedent = require('tedent'),
  vscode = require('vscode')

const { replaceAllTextIn } = require('../vscode-utils'),
  {
    discard,
    endsWith,
    join,
    keepWhen,
    map,
    mMap,
    passThrough,
    removeExtension,
    then,
    toArrayOfValues,
    toBasename,
  } = require('../utils')

const pFs = pify(_fs),
  { dirname } = path

const variantToCommandCb = {
  cjs,
}

const init = () => {
  return passThrough(variantToCommandCb, [
    map(toCommandResult),
    toArrayOfValues,
  ])
}

function toCommandResult(commandCb, variant) {
  return vscode.commands.registerTextEditorCommand(
    `personal.export-${variant}`,
    commandCb
  )
}

async function cjs(textEditor) {
  const { document } = textEditor
  if (document.isUntitled) return

  return passThrough(document.fileName, [
    dirname,
    getCjsExports,
    then(replaceAllTextIn(textEditor)),
  ])
}

function getCjsExports(dirPath) {
  return pFs.readdir(dirPath).then(fileNames => {
    const content = passThrough(fileNames, [
      keepWhen(endsWith('.js')),
      discard('index.js'),
      mMap(toCjsExportLine),
      join('\n'),
    ])

    const exports = tedent(`
      module.exports = {
        ${content}
      }
    `)

    return exports + '\n'
  })
}

function toCjsExportLine(fileName) {
  const varName = camelcase(removeExtension(fileName))
  return `${varName}: require('./${fileName}'),`
}

module.exports = { init }
