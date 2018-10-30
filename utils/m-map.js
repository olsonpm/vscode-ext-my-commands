const getTypedResult = require('./internal/get-typed-result')

const typeToMMap = getTypeToMMap()

const mMap = fn => collection => {
  const typedMMap = getTypedResult(typeToMMap, collection, 'mMap')
  return typedMMap(fn, collection)
}

function mMap_array(mapperFn, anArray) {
  for (let i = 0; i < anArray.length; i += 1) {
    const el = anArray[i]
    anArray[i] = mapperFn(el, i, anArray)
  }

  return anArray
}

function mMap_object(mapperFn, anObject) {
  for (const k of Object.keys(anObject)) {
    anObject[k] = mapperFn(anObject[k], k, anObject)
  }

  return anObject
}

function getTypeToMMap() {
  return {
    array: mMap_array,
    object: mMap_object,
  }
}

module.exports = mMap
