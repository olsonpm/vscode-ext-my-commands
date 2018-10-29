const flip = fn => left => right => fn(right)(left)

module.exports = flip
