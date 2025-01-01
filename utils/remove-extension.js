const removeExtension = fpath => {
  if (fpath.endsWith('.d.ts') || fpath.endsWith('.d.mts')) {
    return fpath.replace(/\.d\.m?ts+$/, '')
  }
  return fpath.replace(/\.[^.]+$/, '')
}

module.exports = removeExtension
