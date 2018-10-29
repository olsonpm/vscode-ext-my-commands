const then = callThis => aPromise => aPromise.then.call(aPromise, callThis)

module.exports = then
