'use strict'
const jts = require('../lib/index')
const test = require('ava')

test('create', t => {
  const p = new jts.parser
  t.truthy(p)
})

test.cb('parse', t => {
  const json = []

  const p = new jts.parser()
    .on('end', () => {
      t.deepEqual(json[0], true)
      t.deepEqual(json[1], 12)
      t.deepEqual(json[2], 'foo')
      t.end()
    }).on('error', e => t.fail(e.message))
    .on('truncated', d => t.fail('truncated'))
    .on('invalid', d => t.fail('invalid'))
    .on('data', j => json.push(j))

  p.write(Buffer.from(jts.RS + 'true\n', 'utf8'))
  p.write(Buffer.from(jts.RS + '12\n', 'utf8'))
  return p.end(Buffer.from(jts.RS + '"foo"\n', 'utf8'))
})

test.cb('truncate', t => {
  let json = null
  let truncated = 0
  const p = new jts.parser()
    .on('end', () => {
      t.is(json, null)
      t.is(truncated, 2)
      t.end()
    }).on('error', e => t.fail(e.message))
    .on('truncated', d => truncated++)
    .on('data', j => json = j)
  p.write(Buffer.from(jts.RS + '"foo', 'utf8'))
  return p.end(Buffer.from(jts.RS + '12', 'utf8'))
})

test.cb('invalid', t => {
  let json = null
  let truncated = false
  let invalid = false
  const p = new jts.parser()
    .on('end', () => {
      t.is(json, null)
      t.falsy(truncated)
      t.truthy(invalid)
      t.end()
    }).on('error', e => t.fail(e.message))
    .on('invalid', d => invalid = true)
    .on('truncated', d => truncated = true)
    .on('data', j => json = j)
  return p.end(Buffer.from(jts.RS + '\n', 'utf8'))
})

test.cb('empty', t => {
  let success = true
  const p = new jts.parser()
    .on('end', () => {
      t.truthy(success)
      t.end()
    }).on('error', e => {
      success = false
      t.fail(e.message)
    }).on('invalid', d => success = false)
    .on('truncated', d => success = false)
    .on('data', j => success = false)
  return p.end(Buffer.from(jts.RS + jts.RS + jts.RS, 'utf8'))
})
