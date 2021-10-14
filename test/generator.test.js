'use strict'

const jts = require('../lib/index')
const test = require('ava')
const {Buffer} = require('buffer')

test('create', t => {
  const g = new jts.Generator()
  t.truthy(g)
})

test.cb('generate', t => {
  const data = []
  const g = new jts.Generator()
  g.on('data', d => data.push(d))
  g.on('error', e => t.fail(e.message))
  g.on('finish', () => {
    t.deepEqual(data[0], Buffer.from('\x1e12\n'))
    t.deepEqual(data[1], Buffer.from('\x1e{"foo":1,"bar":"two"}\n'))
    t.end()
  })

  g.write(12)
  return g.end({
    foo: 1,
    bar: 'two',
  })
})

test.cb('error', t => {
  const a = {}
  a.foo = a
  const g = new jts.Generator()
  g.on('data', d => t.fail('not expecting data'))
  g.on('error', e => {
    t.not(e, null)
    t.end()
  })

  return g.end(a)
})
