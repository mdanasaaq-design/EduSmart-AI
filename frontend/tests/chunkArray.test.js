import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chunkArray } from '../src/utils/chunkArray.js'

test('empty input produces no batches', () => {
  assert.deepEqual(chunkArray([]), [])
})

test('values are chunked at the Firestore in-query limit without loss or duplication', () => {
  const values = Array.from({ length: 65 }, (_, index) => `class-${index + 1}`)
  const batches = chunkArray(values, 30)
  assert.deepEqual(batches.map(batch => batch.length), [30, 30, 5])
  assert.deepEqual(batches.flat(), values)
  assert.equal(new Set(batches.flat()).size, values.length)
})

test('exactly 30 values remain in one batch', () => {
  const values = Array.from({ length: 30 }, (_, index) => index)
  assert.deepEqual(chunkArray(values, 30), [values])
})

test('invalid chunk sizes are rejected', () => {
  assert.throws(() => chunkArray([1, 2], 0), /positive integer/)
  assert.throws(() => chunkArray([1, 2], 1.5), /positive integer/)
})
