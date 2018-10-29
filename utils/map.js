const getTypedResult = require('./internal/get-typed-result')

const typeToMap = getTypeToMap()

const map = fn => collection => {
  const typedMap = getTypedResult(typeToMap, collection, 'map')
  return typedMap(fn, collection)
}

function map_array(mapperFn, anArray) {
  const result = []

  for (let i = 0; i < anArray.length; i += 1) {
    const el = anArray[i]
    result.push(mapperFn(el, i, anArray))
  }

  return result
}

function map_object(mapperFn, anObject) {
  const result = {}

  for (const k of Object.keys(anObject)) {
    result[k] = mapperFn(anObject[k], k, anObject)
  }

  return result
}

function getTypeToMap() {
  return {
    array: map_array,
    object: map_object,
  }
}

module.exports = map
