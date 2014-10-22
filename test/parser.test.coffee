jts = require '../lib/index'

@create = (test) ->
  p = new jts.parser
  test.ok p
  test.done()

@parse = (test) ->
  json = []

  p = new jts.parser()
    .on 'finish', ->
      test.deepEqual json[0], true
      test.deepEqual json[1], 12
      test.deepEqual json[2], "foo"
      test.done()
    .on 'error', (e) ->
      test.ifError e
    .on 'truncated', (d) ->
      test.ok false, 'truncated'
    .on 'invalid', (d) ->
      test.ok false, 'invalid'
    .on 'json', (j) ->
      json.push j
  p.write new Buffer('\x1etrue\n', 'utf8')
  p.write new Buffer('\x1e12\n', 'utf8')
  p.end new Buffer('\x1e"foo"\n', 'utf8')

@truncate = (test) ->
  json = null
  truncated = 0
  p = new jts.parser()
    .on 'finish', ->
      test.ok !json
      test.deepEqual truncated, 2
      test.done()
    .on 'error', (e) ->
      test.ifError e
    .on 'truncated', (d) ->
      truncated++
    .on 'json', (j) ->
      json = j
  p.write new Buffer('\x1e"foo', 'utf8')
  p.end new Buffer('\x1e12', 'utf8')

@invalid = (test) ->
  json = null
  truncated = false
  invalid = false
  p = new jts.parser()
    .on 'finish', ->
      test.ok !json
      test.ok !truncated
      test.ok invalid
      test.done()
    .on 'error', (e) ->
      test.isError(e)
    .on 'invalid', (d) ->
      invalid = true
    .on 'truncated', (d) ->
      truncated = true
    .on 'json', (j) ->
      json = j
  p.end new Buffer('\x1e\n', 'utf8')

@empty = (test) ->
  success = true
  p = new jts.parser()
    .on 'finish', ->
      test.ok success
      test.done()
    .on 'error', (e) ->
      test.isError(e)
      success = false
    .on 'invalid', (d) ->
      success = false
    .on 'truncated', (d) ->
      success = false
    .on 'json', (j) ->
      success = false
  p.end new Buffer('\x1e\x1e\x1e', 'utf8')
