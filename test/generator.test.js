import * as jts from '../lib/index.js';
import {Buffer} from 'node:buffer';
import test from 'ava';

test('create', t => {
  const g = new jts.Generator();
  t.truthy(g);
});

test('generate', t => new Promise((resolve, _reject) => {
  const data = [];
  const g = new jts.Generator();
  g.on('data', d => data.push(d));
  g.on('error', e => t.fail(e.message));
  g.on('finish', () => {
    t.deepEqual(data[0], Buffer.from('\x1e12\n'));
    t.deepEqual(data[1], Buffer.from('\x1e{"foo":1,"bar":"two"}\n'));
    resolve();
  });

  g.write(12);
  g.end({
    foo: 1,
    bar: 'two',
  });
}));

test('error', t => new Promise((resolve, _reject) => {
  const a = {};
  a.foo = a;
  const g = new jts.Generator();
  g.on('data', _d => t.fail('not expecting data'));
  g.on('error', e => {
    t.not(e, null);
    resolve();
  });

  g.end(a);
}));
