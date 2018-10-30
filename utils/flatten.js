const flatten = anArray => {
  const result = []
  for (const el of anArray) {
    if (Array.isArray(el)) result.push(...el)
    else result.push(el)
  }
  return result
}

module.exports = flatten
