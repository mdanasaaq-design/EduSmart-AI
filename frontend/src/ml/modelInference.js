export function runTree(node, features) {
  if (node.leaf !== undefined) return node.leaf
  return features[node.feature] <= node.threshold
    ? runTree(node.left, features)
    : runTree(node.right, features)
}

export function predict(model, features) {
  const votes = model.trees.map(tree => runTree(tree, features))
  const counts = Array(model.classes.length).fill(0)
  votes.forEach(vote => {
    if (!Number.isInteger(vote) || vote < 0 || vote >= counts.length) {
      throw new Error('The Random Forest model contains an invalid class index.')
    }
    counts[vote] += 1
  })
  const index = counts.indexOf(Math.max(...counts))
  return {
    label: model.classes[index],
    confidence: Math.round(counts[index] / model.trees.length * 100),
  }
}

export function validateModel(model) {
  return Boolean(
    model
      && Array.isArray(model.trees)
      && model.trees.length > 0
      && Array.isArray(model.classes)
      && model.classes.length === 3
      && model.classes.every((label, index) => label === ['Low', 'Medium', 'High'][index])
  )
}
