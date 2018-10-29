//
// implementation thanks to Jon Schlinkert
//
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

const repeatStr = n => stringToRepeat => {
  // cover common, quick use cases
  if (n === 1) return stringToRepeat
  if (n === 2) return stringToRepeat + stringToRepeat

  const max = stringToRepeat.length * n
  let result = ''

  while (max > result.length && n > 1) {
    if (n & 1) {
      result += stringToRepeat
    }

    n >>= 1
    stringToRepeat += stringToRepeat
  }

  result += stringToRepeat
  result = result.substr(0, max)

  return result
}

module.exports = repeatStr
