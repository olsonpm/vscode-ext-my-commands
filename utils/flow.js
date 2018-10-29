const passThrough = require('./pass-through')

const flow = fnArray => arg => passThrough(arg, fnArray)

module.exports = flow
