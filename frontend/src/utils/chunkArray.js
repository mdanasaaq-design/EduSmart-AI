export function chunkArray(items, chunkSize = 30) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array')
  if (!Number.isInteger(chunkSize) || chunkSize < 1) {
    throw new RangeError('chunkSize must be a positive integer')
  }
  const chunks = []
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize))
  }
  return chunks
}
