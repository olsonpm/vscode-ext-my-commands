const camelcase = require('camelcase'),
  _fs = require('fs'),
  path = require('path'),
  pify = require('pify'),
  tedent = require('tedent'),
  vscode = require('vscode')

const { replaceAllTextIn } = require('../vscode-utils'),
  asc = require('../utils/compare/string/asc'),
  {
    discardAll,
    endsWith,
    join,
    keepWhen,
    map,
    mMap,
    passThrough,
    removeExtension,
    removeExtensionIfJs,
    mSortBy,
    then,
    toArrayOfValues,
  } = require('../utils')

const camelcaseOpts = { preserveConsecutiveUppercase: true }

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
      mMap(removeExtensionIfJs),
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

function getEsExports(dirPath) {
  return pFs.readdir(dirPath).then(fileNames => {
    const exports = passThrough(fileNames, [
      keepWhen(fname => fname.endsWith('.js') || fname.endsWith('.mjs')),
      discardAll(['index.mjs', 'index.js', 'utils.js']),
      mMap(removeExtensionIfJs),
      mMap(toEsExportLine),
      mSortBy(asc),
      join('\n'),
    ])

    return exports + '\n'
  })
}

function toCjsExportLine(fileName) {
  const varName = camelcase(fileName, camelcaseOpts)
  return `${varName}: require('./${fileName}'),`
}

function isUpper(char) {
  return char === char.toUpperCase() && char !== char.toLowerCase()
}

function upperFirst(str) {
  return str[0].toUpperCase() + str.slice(1)
}

function toEsExportLine(fileName) {
  let varName = camelcase(removeExtension(fileName), camelcaseOpts)

  if (isUpper(fileName[0])) varName = upperFirst(varName)

  return `export { default as ${varName} } from './${fileName}'`
}

module.exports = { init }
