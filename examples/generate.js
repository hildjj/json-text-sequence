'use strict'

const fs = require('fs')
const {Generator} = require('..')

const g = new Generator()
g.pipe(fs.createWriteStream('example.log'))

for (let i = 0; i < 10; i++) {
  g.write({
    d: new Date(),
    count: i,
  })
}
