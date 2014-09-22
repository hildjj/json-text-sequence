jts = require '../lib/index'

@create = (test) ->
  g = new jts.generator
  test.ok g
  test.done()

@generate = (test) ->
  data = []
  g = new jts.generator()
  g.on 'data', (d) ->
    data.push(d)
  g.on 'error', (e) ->
    test.ifError(e)
  g.on 'finish', ->
    test.deepEqual data[0], new Buffer('\x1e12\n')
    test.deepEqual data[1], new Buffer('\x1e{"foo":1,"bar":"two"}\n')
    test.done()

  g.write 12
  g.write
    foo: 1
    bar: "two"
  g.end()

@error = (test) ->
  a = {}
  a.foo = a
  error = null
  g = new jts.generator()
  g.on 'data', (d) ->
    test.ok false, 'not expecting data'
  g.on 'error', (e) ->
    error = e
  g.on 'finish', ->
    test.ok error
    test.done()

  g.end(a)
