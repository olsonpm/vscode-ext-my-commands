#! /usr/bin/env node

const cpy = require('cpy'),
  del = require('del'),
  path = require('path'),
  userHome = require('user-home')

const { name, publisher, version } = require('./package.json'),
  { log } = require('./utils')

const conflictingDirGlob = `${publisher}.${name}-*`,
  extensionsDir = path.join(userHome, '.vscode-oss/extensions'),
  destinationDir = path.join(extensionsDir, `${publisher}.${name}-${version}`)

del(conflictingDirGlob, { cwd: extensionsDir })
  .then(() =>
    cpy('**/*', destinationDir, {
      cwd: __dirname,
      parents: true,
    })
  )
  .then(() => {
    log('success :)')
  })
