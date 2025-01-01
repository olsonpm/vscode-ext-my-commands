module.exports = fname => {
  const i = fname.lastIndexOf('.')
  if (i < 0) return ''

  return fname.slice(i + 1)
}
