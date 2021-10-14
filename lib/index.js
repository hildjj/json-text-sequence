'use strict'

const stream = require('stream')
const {DelimitedStream} = require('@sovpro/delimited-stream')

const RS = '\x1e'
exports.RS = RS

// Parse a JSON text sequence stream as defined in
// {http://tools.ietf.org/html/draft-ietf-json-text-sequence
//  draft-ietf-json-text-sequence}.
// If you read() from this stream, each read() will return a single valid object
// from the stream.  However, streaming mode is much more likely to be what you
// want:
//
// Generates the following events in addition to those emitted by a normal
// Transform stream:
//
// @event data(object) found a valid JSON item in the stream
//   @param object [any] the value
// @event truncated(Buffer) a JSON-text got truncated.  The truncated Buffer
//   is included in case you can do something with it.  This is a recoverable
//   error.
// @event invalid(Buffer) an un-truncated, but otherwise invalid JSON-text was
//   found in the stream.  This is likely a programming error on the sending
//   side, or some sort of horrible chocolate-in-peanutbutter interleaved I/O
//   issue.  This is still a recoverable error, but you might want to warn
//   more loudly about these than the truncated ones.
//
// @example Parse stdin
//   var parser = require('json-text-sequence').parser;
//   var p = new parser()
//     .on('data', function(obj) {
//        console.log('Valid', obj);
//     })
//     .on('truncated', function(buf) {
//       console.warn('Truncated', buf);
//     })
//     .on('invalid', function(buf) {
//       console.warn('Invalid', buf);
//     });
//   process.stdin.pipe(p);
class JSONSequenceParser extends stream.Transform {
  /**
   * Create a JSONSequenceParser instance.
   *
   * @param {stream.TransformOptions} [opts] Stream options.
   */
  constructor(opts = {}) {
    super({
      ...opts,
      readableObjectMode: true,
    })
    this._stream = new DelimitedStream(RS)
      .on('data', d => {
        // NOTE: delimited-stream will deal with repeated delimiters.
        // d.length will always be > 0
        // assert.ok(d.length > 0)

        // If the entry doesn't end with \n, it got truncated
        if (d[d.length - 1] === 0x0a) {
          try {
            const j = JSON.parse(d)
            this.push(j)
          } catch (ignored) {
            this.emit('invalid', d)
          }
        } else {
          this.emit('truncated', d)
        }
      })
  }

  // @nodoc
  _transform(chunk, encoding, cb) {
    this._stream.write(chunk, encoding, cb)
  }

  // @nodoc
  _final(cb) {
    this._stream.end(null, null, cb)
  }
}

/** @deprecated */
exports.parser = JSONSequenceParser
exports.Parser = JSONSequenceParser

// Generate a JSON text sequence stream as defined in
// {http://tools.ietf.org/html/draft-ietf-json-text-sequence
//  draft-ietf-json-text-sequence}.  Write objects to the stream, and pipe
//  the output to wherever it may make sense, such as a file.
//
// @example write to stdout
//   var generator = require('json-text-sequence').generator;
//   var g = new generator()
//   g.pipe(process.stdout);
//   g.write({foo: true, bar: 1})
class JSONSequenceGenerator extends stream.Transform {
  /**
   * Create a JSONSequenceGenerator instance.
   *
   * @param {stream.TransformOptions} [opts] Stream options.
   */
  constructor(opts = {}) {
    super({
      ...opts,
      writableObjectMode: true,
    })
  }

  // @nodoc
  _transform(chunk, encoding, cb) {
    let s = null
    try {
      // This can fail on circular objects, for example
      s = JSON.stringify(chunk)
    } catch (error) {
      return cb(error)
    }

    this.push(`${RS}${s}\n`, 'utf8')
    return cb()
  }
}

/** @deprecated */
exports.generator = JSONSequenceGenerator
exports.Generator = JSONSequenceGenerator
