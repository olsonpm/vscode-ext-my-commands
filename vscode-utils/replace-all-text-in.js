const replaceAllTextWith = require('./replace-all-text-with')

const { flip } = require('../utils')

const replaceAllTextIn = flip(replaceAllTextWith)

module.exports = replaceAllTextIn
