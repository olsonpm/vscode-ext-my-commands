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
    getExt,
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

  const fpath = document.fileName
  const ext = getExt(fpath)

  if (!ext) return

  const exportsStr = await getEsExports({ fpath, ext })
  return replaceAllTextIn(textEditor)(exportsStr)
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

async function getEsExports({ fpath, ext }) {
  const dirPath = dirname(fpath)
  const fileNames = await pFs.readdir(dirPath)

  let exportsStr
  if (['js', 'mjs'].includes(ext)) {
    exportsStr = passThrough(fileNames, [
      keepWhen(fname => fname.endsWith('.js') || fname.endsWith('.mjs')),
      discardAll(['index.mjs', 'index.js', 'utils.js']),
      mMap(removeExtensionIfJs),
      mMap(toEsExportLine),
      mSortBy(asc),
      join('\n'),
    ])
  } else if (fpath.endsWith('d.mts') || fpath.endsWith('.d.ts')) {
    exportsStr = passThrough(fileNames, [
      keepWhen(fname => fname.endsWith('.d.mts') || fname.endsWith('.d.ts')),
      discardAll(['index.d.mts', 'index.d.ts']),
      mMap(toTypeEsExportLine),
      mSortBy(asc),
      join('\n'),
    ])
  }

  return exportsStr + '\n'
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

function toTypeEsExportLine(fileName) {
  let varName = camelcase(removeExtension(fileName), camelcaseOpts)

  if (isUpper(fileName[0])) varName = upperFirst(varName)

  return `export type { default as ${varName} } from './${fileName}'`
}

module.exports = { init }
