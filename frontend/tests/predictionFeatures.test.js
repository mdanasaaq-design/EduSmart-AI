import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MAX_TRAINED_MISSED_ASSESSMENTS, parseMissedAssessments } from '../src/ml/predictionFeatures.js'

test('missed-assessment input remains unset when no count is supplied', () => {
  assert.equal(parseMissedAssessments(''), null)
  assert.equal(parseMissedAssessments('   '), null)
  assert.equal(parseMissedAssessments(null), null)
  assert.equal(parseMissedAssessments(undefined), null)
})

test('missed-assessment input accepts integer values within the training domain', () => {
  assert.equal(parseMissedAssessments('0'), 0)
  assert.equal(parseMissedAssessments(0), 0)
  assert.equal(parseMissedAssessments('4'), 4)
  assert.equal(parseMissedAssessments(String(MAX_TRAINED_MISSED_ASSESSMENTS)), 7)
})

test('missed-assessment input rejects fractions, negatives and out-of-domain counts', () => {
  assert.equal(parseMissedAssessments('1.5'), null)
  assert.equal(parseMissedAssessments(-1), null)
  assert.equal(parseMissedAssessments('8'), null)
  assert.equal(parseMissedAssessments('not a number'), null)
})
