const cpy = require('cpy'),
  del = require('del'),
  path = require('path'),
  userHome = require('user-home')

const { name, publisher, version } = require('./package.json')

const conflictingDirGlob = `${publisher}.${name}-*`,
  extensionsDir = path.join(userHome, '.vscode/extensions'),
  destinationDir = path.join(extensionsDir, `${publisher}.${name}-${version}`)

del(conflictingDirGlob, { cwd: extensionsDir }).then(() =>
  cpy('**/*', destinationDir, {
    cwd: __dirname,
    parents: true,
  })
)
