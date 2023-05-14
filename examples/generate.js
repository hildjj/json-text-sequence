import {Generator} from '../lib/index.js'
import fs from 'fs'

const g = new Generator()
g.pipe(fs.createWriteStream('example.log'))

for (let i = 0; i < 10; i++) {
  g.write({
    d: new Date(),
    count: i,
  })
}
