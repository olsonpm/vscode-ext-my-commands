const { basename } = require('path')

const toBasename = filePath => basename(filePath)

module.exports = toBasename
