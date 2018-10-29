const getTypedResult = require('./internal/get-typed-result')

const typeToAppend = getTypeToAppend()

const append = fn => collection => {
  const typedAppend = getTypedResult(typeToAppend, collection, 'map')
  return typedAppend(fn, collection)
}

function append_array(el, anArray) {
  return anArray.concat(el)
}

function append_string(appendThis, toThis) {
  return toThis + appendThis
}

function getTypeToAppend() {
  return {
    array: append_array,
    string: append_string,
  }
}

module.exports = append
