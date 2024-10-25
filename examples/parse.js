/* eslint-disable no-console */

import {Parser} from '../lib/index.js';
import fs from 'node:fs';

const p = new Parser()
  .on('json', obj => {
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
