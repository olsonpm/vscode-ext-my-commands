const passThrough = (arg, fnArray) =>
  fnArray.reduce((result, nextFn) => nextFn(result), arg)

module.exports = passThrough
