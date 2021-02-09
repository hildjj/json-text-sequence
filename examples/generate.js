'use strict'

const fs = require('fs')
const generator = require('..').generator

const g = new generator()
g.pipe(fs.createWriteStream('example.log'))

for (let i=0; i<10; i++) {
  g.write({
    d: new Date(),
    count: i
  })
}
