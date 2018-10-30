const getTypedResult = require('./internal/get-typed-result')

const typeToForEach = getTypeToForEach()

const forEach = fn => collection => {
  const typedForEach = getTypedResult(typeToForEach, collection, 'forEach')
  return typedForEach(fn, collection)
}

function forEach_array(fn, anArray) {
  for (let i = 0; i < anArray.length; i += 1) {
    const el = anArray[i]
    fn(el, i, anArray)
  }

  return anArray
}

function forEach_object(fn, anObject) {
  for (const k of Object.keys(anObject)) {
    fn(anObject[k], k, anObject)
  }

  return anObject
}

function getTypeToForEach() {
  return {
    array: forEach_array,
    object: forEach_object,
  }
}

module.exports = forEach
