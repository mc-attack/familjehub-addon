import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publish } from './publish-addon.mjs';

function fixture(fn) {
  const old = process.cwd(), dir = mkdtempSync(join(tmpdir(), 'familjehub-publish-'));
  try {
    process.chdir(dir);
    mkdirSync('templates');
    writeFileSync('templates/familjehub.yaml', 'version: "__VERSION__"\nimage: ghcr.io/mc-attack/familjehub-{arch}\n');
    fn();
  } finally { process.chdir(old); rmSync(dir, { recursive: true, force: true }); }
}
const sha = 'a'.repeat(40);
test('all images are checked before metadata is written', () => fixture(() => {
  const seen = [];
  publish('0.11.0', { source: sha, verifyImage: image => seen.push(image) });
  assert.equal(seen.length, 3);
  assert.ok(seen.every(image => image.endsWith(':0.11.0')));
  assert.match(readFileSync('familjehub/config.yaml', 'utf8'), /version: "0.11.0"/);
  assert.deepEqual(JSON.parse(readFileSync('familjehub/release.json', 'utf8')), { version: '0.11.0', source: sha });
}));
test('a missing image creates no installation post', () => fixture(() => {
  let calls = 0;
  assert.throws(() => publish('0.11.0', { source: sha, verifyImage: () => { if (++calls === 3) throw new Error('missing image'); } }), /missing image/);
  assert.equal(existsSync('familjehub/config.yaml'), false);
  assert.equal(existsSync('familjehub/release.json'), false);
}));
test('older releases and reused versions with different code are rejected', () => fixture(() => {
  const options = { source: sha, verifyImage: () => {} };
  publish('0.11.0', options);
  assert.throws(() => publish('0.10.0', options), /äldre/);
  assert.throws(() => publish('0.11.0', { ...options, source: 'b'.repeat(40) }), /annan kod/);
  publish('0.11.0', { source: null, verifyImage: () => {} });
  assert.equal(JSON.parse(readFileSync('familjehub/release.json', 'utf8')).source, sha);
}));
test('invalid versions and source are rejected before image checks', () => fixture(() => {
  const verifyImage = () => assert.fail('must not contact GHCR');
  assert.throws(() => publish('latest', { verifyImage }));
  assert.throws(() => publish('0.11.0', { source: 'not-a-sha', verifyImage }), /källrevision/);
}));
