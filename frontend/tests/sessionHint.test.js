import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { hasSessionHint, setSessionHint } from '../src/utils/sessionHint.js'

const originalWindow = globalThis.window

afterEach(() => {
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
})

function installStorage(initial = {}) {
  const values = new Map(Object.entries(initial))
  globalThis.window = {
    localStorage: {
      getItem: key => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: key => values.delete(key),
    },
  }
  return values
}

test('session hint is false when no browser storage is available', () => {
  delete globalThis.window
  assert.equal(hasSessionHint(), false)
  assert.doesNotThrow(() => setSessionHint(true))
})

test('session hint reads only the non-sensitive presence flag', () => {
  installStorage({ 'edusmart-session-present': '1' })
  assert.equal(hasSessionHint(), true)
})

test('session hint can be set and cleared without storing identity or role data', () => {
  const values = installStorage()
  setSessionHint(true)
  assert.equal(hasSessionHint(), true)
  assert.deepEqual([...values.entries()], [['edusmart-session-present', '1']])
  setSessionHint(false)
  assert.equal(hasSessionHint(), false)
  assert.equal(values.size, 0)
})
