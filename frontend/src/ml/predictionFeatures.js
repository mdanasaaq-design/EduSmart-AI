export const MAX_TRAINED_MISSED_ASSESSMENTS = 7

/**
 * Parse the explicit missed-assessment count accepted by the demo model.
 * The synthetic training data uses integer values from 0 through 7 inclusive.
 * Return null for empty or out-of-domain input rather than guessing a count.
 */
export function parseMissedAssessments(value) {
  if (value === '' || value === null || value === undefined) return null
  if (typeof value === 'string' && value.trim() === '') return null

  const count = Number(value)
  if (!Number.isInteger(count) || count < 0 || count > MAX_TRAINED_MISSED_ASSESSMENTS) {
    return null
  }
  return count
}
