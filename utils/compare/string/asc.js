module.exports = (left, right) =>
  left.localeCompare(right, undefined, { sensitivity: 'base' })
