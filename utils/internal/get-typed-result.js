const tedent = require('tedent')

const getType = require('./get-type'),
  hasOwnKey = require('../has-own-key')

const getTypedResult = (typeToSomething, x, callerName) => {
  const xType = getType(x)
  if (hasOwnKey(xType)(typeToSomething)) {
    return typeToSomething[xType]
  }

  const supportedTypes = Object.keys(typeToSomething).join(', ')
  throw new Error(
    tedent(`
      ${callerName} does not support the type ${xType}
      supported types: ${supportedTypes}
    `)
  )
}

module.exports = getTypedResult
