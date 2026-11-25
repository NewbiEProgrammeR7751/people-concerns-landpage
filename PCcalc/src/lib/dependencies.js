/**
 * Feature dependency helpers. A feature may declare `requiredParentId`; the
 * parent must be in the quote for the child to make sense.
 *
 * Every walk carries a `seen` set, so a malformed catalog that loops back on
 * itself is traversed once rather than hanging the tab.
 */

const byId = (catalog) => new Map(catalog.map((feature) => [feature.id, feature]))

/** The chain of parents above `id`, nearest first. */
export function ancestorsOf(catalog, id) {
  const index = byId(catalog)
  const chain = []
  const seen = new Set([id])

  let current = index.get(id)?.requiredParentId
  while (current && !seen.has(current)) {
    seen.add(current)
    const parent = index.get(current)
    if (!parent) break
    chain.push(parent.id)
    current = parent.requiredParentId
  }
  return chain
}

/** Everything that depends on `id`, directly or transitively. */
export function descendantsOf(catalog, id) {
  const children = new Map()
  for (const feature of catalog) {
    if (!feature.requiredParentId) continue
    const siblings = children.get(feature.requiredParentId) ?? []
    siblings.push(feature.id)
    children.set(feature.requiredParentId, siblings)
  }

  const found = []
  const seen = new Set([id])
  const queue = [id]

  while (queue.length > 0) {
    const current = queue.shift()
    for (const child of children.get(current) ?? []) {
      if (seen.has(child)) continue
      seen.add(child)
      found.push(child)
      queue.push(child)
    }
  }
  return found
}

/**
 * Would making `parentId` the parent of `featureId` create a cycle? Used to
 * keep the admin form from letting a feature require its own descendant.
 */
export function wouldCycle(catalog, featureId, parentId) {
  if (!parentId) return false
  if (parentId === featureId) return true
  return descendantsOf(catalog, featureId).includes(parentId)
}
