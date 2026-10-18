import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { predict, validateModel } from '../src/ml/modelInference.js'

const model = JSON.parse(readFileSync(new URL('../public/model.json', import.meta.url), 'utf8'))
const fixture = JSON.parse(readFileSync(new URL('../../ml/model_test_vectors.json', import.meta.url), 'utf8'))

test('the shipped Random Forest artifact uses the supported class contract', () => {
  assert.equal(validateModel(model), true)
  assert.equal(model.trees.length, 40)
  assert.deepEqual(model.classes, ['Low', 'Medium', 'High'])
})

test('fixed feature vectors match expected exported-model labels and vote shares', () => {
  for (const item of fixture.vectors) {
    const result = predict(model, item.features)
    assert.equal(result.label, item.expectedLabel, item.name)
    assert.equal(result.confidence, item.expectedVoteShare, item.name)
  }
})

test('invalid class indices are rejected instead of silently corrupting risk labels', () => {
  assert.throws(
    () => predict({ classes: ['Low', 'Medium', 'High'], trees: [{ leaf: 9 }] }, [1, 1, 1, 1]),
    /invalid class index/,
  )
})
