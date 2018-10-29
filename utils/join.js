const getTypedResult = require('./internal/get-typed-result')

const typeToJoin = getTypeToJoin()

const join = separator => collection => {
  const typedJoin = getTypedResult(typeToJoin, collection, 'join')
  return typedJoin(separator, collection)
}

function join_array(separator, anArray) {
  return anArray.join(separator)
}

function getTypeToJoin() {
  return {
    array: join_array,
  }
}

module.exports = join
