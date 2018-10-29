const getTypedResult = require('./internal/get-typed-result')

const typeToDiscard = getTypeToDiscard()

const discard = value => collection => {
  const typedDiscard = getTypedResult(typeToDiscard, collection, 'discard')
  return typedDiscard(value, collection)
}

function discard_array(discardThis, anArray) {
  const result = []

  for (let i = 0; i < anArray.length; i += 1) {
    const el = anArray[i]
    if (el !== discardThis) result.push(el)
  }

  return result
}

function discard_object(dicardThis, anObject) {
  const result = {}

  for (const key of Object.keys(anObject)) {
    const val = anObject[key]
    if (val !== dicardThis) result[key] = val
  }

  return result
}

function getTypeToDiscard() {
  return {
    array: discard_array,
    object: discard_object,
  }
}

module.exports = discard
