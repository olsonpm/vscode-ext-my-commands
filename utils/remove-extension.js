const removeExtension = fpath => {
  return fpath.endsWith('.d.ts')
    ? fpath.slice(0, -'.d.ts'.length)
    : fpath.replace(/\.[^.]+$/, '')
}

module.exports = removeExtension
