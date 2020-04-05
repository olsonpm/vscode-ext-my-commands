const getTypedResult = require('./internal/get-typed-result'),
  getType = require('./internal/get-type')

const typeToDiscardAll = getTypeToDiscardAll(),
  setOrArray = new Set(['set', 'array'])

const discardAll = values => {
  const valuesType = getType(values)

  if (!setOrArray.has(valuesType)) {
    throw new Error('values must be an Array or Set')
  }

  values = valuesType === 'array' ? new Set(values) : values

  return collection => {
    const typedDiscardAll = getTypedResult(
      typeToDiscardAll,
      collection,
      'discardAll'
    )
    return typedDiscardAll(values, collection)
  }
}

function discardAll_array(discardThese, anArray) {
  const result = []

  for (let i = 0; i < anArray.length; i += 1) {
    const el = anArray[i]
    if (!discardThese.has(el)) result.push(el)
  }

  return result
}

function discardAll_object(discardThese, anObject) {
  const result = {}

  for (const key of Object.keys(anObject)) {
    const val = anObject[key]
    if (!discardThese.has(val)) result[key] = val
  }

  return result
}

function getTypeToDiscardAll() {
  return {
    array: discardAll_array,
    object: discardAll_object,
  }
}

module.exports = discardAll
