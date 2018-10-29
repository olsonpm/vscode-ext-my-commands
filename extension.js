const commands = require('./commands')

const {
  flatten,
  invokeKey,
  mMap,
  noop,
  passThrough,
  toArrayOfValues,
} = require('./utils')

const activate = context => {
  const disposables = passThrough(commands, [
    toArrayOfValues,
    mMap(invokeKey('init')),
    flatten,
  ])

  context.subscriptions.push(...disposables)
}

const deactivate = noop

module.exports = { activate, deactivate }
