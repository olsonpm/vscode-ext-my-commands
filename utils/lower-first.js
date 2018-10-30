const lowerFirst = str => {
  if (!str) return ''
  return str[0].toLowerCase() + str.slice(1)
}

module.exports = lowerFirst
