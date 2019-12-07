import { Trie, initialNodeIdentifier, FullTrie } from './trie'

export const findNode = (trie: Trie, identifier: string): Trie | null => {
  if (trie.identifier === identifier) {
    return trie
  }

  for (let child of trie.children) {
    const node = findNode(child, identifier)

    if (node) {
      return node
    }
  }

  return null
}

export const isInParent = (trie: Trie, parent: Trie) => {
  let cursor = trie
  let steps = 0

  while (1) {
    if (cursor.identifier === parent.identifier) {
      return steps
    }

    if (cursor.identifier === initialNodeIdentifier) {
      break
    }

    cursor = cursor.parent!
    steps += 1
  }

  return -1
}

export const getCommonParent = (a: Trie, b: Trie) => {
  // starting arbitrarily from a
  let cursor = a
  let commonParent
  do {
    let parent = cursor.parent

    if (!parent) {
      throw new Error('No common parent found')
    }

    if (isInParent(b, parent) > -1) {
      commonParent = parent
      break
    }

    cursor = parent
  } while (!commonParent)

  return commonParent
}

export const nodesToTarget = (trie: Trie, target: Trie): number => {
  // target is one of my child
  const stepsToChildTarget = isInParent(target, trie)
  if (stepsToChildTarget > -1) {
    return stepsToChildTarget
  }

  // target is one of my parent
  const stepsToParentTarget = isInParent(trie, target)
  if (stepsToParentTarget > -1) {
    return stepsToParentTarget
  }

  const commonParent = getCommonParent(trie, target)

  const stepsFromAToCommon = nodesToTarget(trie, commonParent)
  const stepsFromCommonToB = nodesToTarget(commonParent, target)

  return stepsFromAToCommon - 1 + stepsFromCommonToB - 1
}
