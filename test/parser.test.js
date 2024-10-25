import * as jts from '../lib/index.js';
import {Buffer} from 'node:buffer';
import test from 'ava';

test('create', t => {
  const p = new jts.Parser();
  t.truthy(p);
});

test('parse', t => new Promise((resolve, reject) => {
  const json = [];

  const p = new jts.Parser()
    .on('end', () => {
      t.is(json[0], true);
      t.is(json[1], 12);
      t.is(json[2], 'foo');
      resolve();
    })
    .on('error', reject)
    .on('truncated', _d => t.fail('truncated'))
    .on('invalid', _d => t.fail('invalid'))
    .on('data', j => json.push(j));

  p.write(Buffer.from(`${jts.RS}true\n`, 'utf8'));
  p.write(Buffer.from(`${jts.RS}12\n`, 'utf8'));
  p.end(Buffer.from(`${jts.RS}"foo"\n`, 'utf8'));
}));

test('truncate', t => new Promise((resolve, reject) => {
  let json = null;
  let truncated = 0;
  const p = new jts.Parser()
    .on('end', () => {
      t.is(json, null);
      t.is(truncated, 2);
      resolve();
    })
    .on('error', reject)
    .on('truncated', _d => truncated++)
    .on('data', j => (json = j));
  p.write(Buffer.from(`${jts.RS}"foo`, 'utf8'));
  p.end(Buffer.from(`${jts.RS}12`, 'utf8'));
}));

test('invalid', t => new Promise((resolve, reject) => {
  let json = null;
  let truncated = false;
  let invalid = false;
  const p = new jts.Parser()
    .on('end', () => {
      t.is(json, null);
      t.falsy(truncated);
      t.truthy(invalid);
      resolve();
    })
    .on('error', reject)
    .on('invalid', _d => (invalid = true))
    .on('truncated', _d => (truncated = true))
    .on('data', j => (json = j));
  p.end(Buffer.from(`${jts.RS}\n`, 'utf8'));
}));

test('empty', t => new Promise((resolve, reject) => {
  let success = true;
  const p = new jts.Parser()
    .on('end', () => {
      t.truthy(success);
      resolve();
    })
    .on('error', e => {
      success = false;
      reject(e);
    })
    .on('invalid', _d => (success = false))
    .on('truncated', _d => (success = false))
    .on('data', _j => (success = false));
  p.end(Buffer.from(jts.RS + jts.RS + jts.RS, 'utf8'));
}));
