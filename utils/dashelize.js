const decamelize = require('decamelize')

const dashelize = str => decamelize(str, '-')

module.exports = dashelize
