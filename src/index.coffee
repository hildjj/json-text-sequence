stream = require 'stream'
DelimitStream = require 'delimit-stream'

# Parse a JSON text sequence stream as defined in
# {http://tools.ietf.org/html/draft-ietf-json-text-sequence
#  draft-ietf-json-text-sequence}.
# If you read() from this stream, each read() will return a single valid object
# from the stream.  However, streaming modeis much more likely to be what you
# want:
#
# Generates the following events in addition to those emitted by a normal
# Transform stream:
#
# @event json(object) found a valid JSON item in the stream
#   @param object [any] the value
# @event truncated(Buffer) a JSON-text got truncated.  The truncated Buffer is
#   included in case you can do something with it.  This is a recoverable error.
# @event invalid(Buffer) an un-truncated, but otherwise invalid JSON-text was
#   found in the stream.  This is likely a programming error on the sending
#   side, or some sort of horrible chocolate-in-peanutbutter interleaved I/O
#   issue.  This is still a recoverable error, but you might want to warn
#   more loudly about these than the truncated ones.
#
# @example Parse stdin
#   var parser = require('json-text-sequence').parser;
#   var p = new parser()
#     .on('json', function(obj) {
#        console.log('Valid', obj);
#     })
#     .on('truncated', function(buf) {
#       console.warn('Truncated', buf);
#     })
#     .on('invalid', function(buf) {
#       console.warn('Invalid', buf);
#     });
#   process.stdin.pipe(p);
class JSONSequenceParser extends stream.Transform
  # @nodoc
  constructor: ->
    super()
    @_readableState.objectMode = true
    that = @
    @_stream = new DelimitStream('\x1e')
      .on 'readable', ->
        that.emit 'readable'
      .on 'error', (e) ->
        # I can't fingure out how to make 'error' happen.  Maybe it can't?
        `// istanbul ignore next`
        that.emit 'error', e
      .on 'data', (d) ->
        # if the entry doesn't end with \n, it got truncated
        if d[d.length - 1] != 0x0a
          that.emit 'truncated', d
        else
          try
            j = JSON.parse d
            that.emit 'json', j
            that.push j
          catch error
            that.emit 'invalid', d

  # @nodoc
  _transform: (chunk, encoding, cb) ->
    @_stream.write(chunk, encoding, cb)

  # @nodoc
  _flush: (cb)->
    @_stream._flush(cb)
exports.parser = JSONSequenceParser

# Generate a JSON text sequence stream as defined in
# {http://tools.ietf.org/html/draft-ietf-json-text-sequence
#  draft-ietf-json-text-sequence}.  Write objects to the stream, and pipe
#  the output to wherever it may make sense, such as a file.
#
# @example write to stdout
#   var generator = require('json-text-sequence').generator;
#   var g = new generator()
#   g.pipe(process.stdout);
#   g.write({foo: true, bar: 1})
class JSONSequenceGenerator extends stream.Transform
  # @nodoc
  constructor: ->
    super()
    @_writableState.objectMode = true
    @_readableState.objectMode = false

  # @nodoc
  _transform: (chunk, encoding, cb) ->
    s = null
    try
      # this can fail on circular objects, for example
      s = JSON.stringify(chunk, 'utf8')
    catch error
      return cb(error)

    @push "\x1e#{s}\n", 'utf8'
    cb()
exports.generator = JSONSequenceGenerator
