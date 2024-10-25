# json-text-sequence

Parse and generate JSON text sequences as defined in [RFC 7464](https://tools.ietf.org/html/rfc7464).

JSON text sequences are nice for unambiguous JSON log files.  They are resilient
to many forms of damage such as truncation, multiple writers incorrectly
configured to write to the same file, corrupted JSON, etc.  An example sequence:

    ␞{"d":"2014-09-22T21:58:35.270Z","value":6}␤
    ␞{"d":"2014-09-22T21:59:15.117Z","value":12}␤

Where "␞" is the ASCII "Record Separator" character (U+001E), and "␤" is the
ASCII "LINE FEED" character (U+000A), otherwise known as "\n".

## Installation

    npm install json-text-sequence

## API

### Parsing

To parse the format, pipe an input source into a parser stream:

```js
import {Parser} from 'json-text-sequence'
import fs from 'fs'

const p = new Parser()
  .on('data', obj => {
    console.log('JSON:', obj);
  })
  .on('truncated', buf => {
    console.log('Truncated:', buf);
  })
  .on('invalid', buf => {
    console.log('Invalid:', buf);
  })
  .on('finish', () => {
    console.log('DONE');
  });

fs.createReadStream('example.log').pipe(p);
```

### Generation

To generate the format, create a generator, pipe its output somewhere
interesting, then write objects to the generator:

```js
import {Generator} from 'json-text-sequence'
import fs from 'fs'

const g = new Generator();
g.pipe(fs.createWriteStream('example.log'));

g.write({
  d: new Date(),
  count: 0
});
```

---
[![Tests](https://github.com/hildjj/json-text-sequence/workflows/Tests/badge.svg)](https://github.com/hildjj/json-text-sequence/actions?query=workflow%3ATests)
[![codecov](https://codecov.io/gh/hildjj/json-text-sequence/graph/badge.svg?token=eBBBlbwJLl)](https://codecov.io/gh/hildjj/json-text-sequence)
