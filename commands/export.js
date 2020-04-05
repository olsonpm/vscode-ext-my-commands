const camelcase = require('camelcase'),
  _fs = require('fs'),
  path = require('path'),
  pify = require('pify'),
  tedent = require('tedent'),
  vscode = require('vscode')

const { replaceAllTextIn } = require('../vscode-utils'),
  {
    discardAll,
    endsWith,
    join,
    keepWhen,
    map,
    mMap,
    passThrough,
    removeExtension,
    then,
    toArrayOfValues,
  } = require('../utils')

const pFs = pify(_fs),
  { dirname } = path

const variantToCommandCb = {
  cjs,
  es,
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

async function es(textEditor) {
  const { document } = textEditor
  if (document.isUntitled) return

  return passThrough(document.fileName, [
    dirname,
    getEsExports,
    then(replaceAllTextIn(textEditor)),
  ])
}

function getCjsExports(dirPath) {
  return pFs.readdir(dirPath).then(fileNames => {
    const content = passThrough(fileNames, [
      keepWhen(endsWith('.js')),
      discardAll(['index.js', 'utils.js']),
      mMap(removeExtension),
      mMap(toCjsExportLine),
      join('\n'),
    ])

    console.log(content)

    const exports = tedent(`
      module.exports = {
        ${content}
      }
    `)

    return exports + '\n'
  })
}

function getEsExports(dirPath) {
  return pFs.readdir(dirPath).then(fileNames => {
    const exports = passThrough(fileNames, [
      keepWhen(endsWith('.js')),
      discardAll(['index.js', 'utils.js']),
      mMap(removeExtension),
      mMap(toEsExportLine),
      join('\n'),
    ])

    return exports + '\n'
  })
}

function toCjsExportLine(fileName) {
  const varName = camelcase(fileName)
  return `${varName}: require('./${fileName}'),`
}

function isUpper(char) {
  return char === char.toUpperCase() && char !== char.toLowerCase()
}

function upperFirst(str) {
  return str[0].toUpperCase() + str.slice(1)
}

function toEsExportLine(fileName) {
  let varName = camelcase(removeExtension(fileName))

  if (isUpper(fileName[0])) varName = upperFirst(varName)

  return `export { default as ${varName} } from './${fileName}'`
}

module.exports = { init }
