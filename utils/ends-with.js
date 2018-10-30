const endsWith = suffix => fullStr => fullStr.slice(-suffix.length) === suffix

module.exports = endsWith
