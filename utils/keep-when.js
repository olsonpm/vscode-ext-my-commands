const getTypedResult = require('./internal/get-typed-result')

const typeToKeepWhen = getTypeToKeepWhen()

const keepWhen = predicate => collection => {
  const typedKeepWhen = getTypedResult(typeToKeepWhen, collection, 'keepWhen')
  return typedKeepWhen(predicate, collection)
}

function keepWhen_array(shouldKeep, anArray) {
  const result = []

  for (let i = 0; i < anArray.length; i += 1) {
    const el = anArray[i]
    if (shouldKeep(el, i, anArray)) result.push(el)
  }

  return result
}

function keepWhen_object(shouldKeep, anObject) {
  const result = {}

  for (const key of Object.keys(anObject)) {
    const val = anObject[key]
    if (shouldKeep(val, key, anObject)) result[key] = val
  }

  return result
}

function getTypeToKeepWhen() {
  return {
    array: keepWhen_array,
    object: keepWhen_object,
  }
}

module.exports = keepWhen
