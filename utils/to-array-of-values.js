const getTypedResult = require('./internal/get-typed-result')

const typeToArrayOfValues = getTypeToArrayOfValues()

const toArrayOfValues = collection => {
  const typedArrayOfValues = getTypedResult(
    typeToArrayOfValues,
    collection,
    'toArrayOfValues'
  )
  return typedArrayOfValues(collection)
}

function arrayOfValues_object(anObject) {
  const result = []

  for (const k of Object.keys(anObject)) {
    result.push(anObject[k])
  }

  return result
}

function getTypeToArrayOfValues() {
  return {
    object: arrayOfValues_object,
  }
}

module.exports = toArrayOfValues
