const SESSION_HINT_KEY = 'edusmart-session-present'

export function hasSessionHint() {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(SESSION_HINT_KEY) === '1'
  } catch {
    return false
  }
}

export function setSessionHint(present) {
  try {
    if (typeof window === 'undefined') return
    if (present) window.localStorage.setItem(SESSION_HINT_KEY, '1')
    else window.localStorage.removeItem(SESSION_HINT_KEY)
  } catch {
    // Storage is only a performance hint. Firebase Auth remains the authority.
  }
}
