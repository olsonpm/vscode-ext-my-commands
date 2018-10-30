const startsWith = prefix => fullStr =>
  fullStr.slice(0, prefix.length) === prefix

module.exports = startsWith
