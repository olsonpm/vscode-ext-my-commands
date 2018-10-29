const typeDetect = require('type-detect')

const lowerFirst = require('../lower-first')

const getType = something => lowerFirst(typeDetect(something))

module.exports = getType
