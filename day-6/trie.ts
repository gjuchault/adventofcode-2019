export type Trie = {
  identifier: string
  parent?: Trie
  totalIndirectOrbits?: number
  children: Trie[]
}

export type FullTrie = Exclude<Trie, 'parent'> & {
  mapQueue: MapQueue
  totalIndirectOrbits: number
}

export type MapQueue = Map<string, Set<string>>

export const initialNodeIdentifier = 'COM'

export const buildTrie = (input: string[]) => {
  const map: MapQueue = new Map<string, Set<string>>()

  for (const entry of input) {
    const [left, right] = entry.split(')')

    const entrySet = map.get(left.trim())

    if (!entrySet) {
      map.set(left.trim(), new Set([right.trim()]))
      continue
    }

    entrySet.add(right.trim())
  }

  const trie: FullTrie = {
    identifier: initialNodeIdentifier,
    totalIndirectOrbits: 0,
    children: [],
    mapQueue: map
  }

  insertNodeAndChildrenInTrie(trie, trie, map, 0)

  return trie
}

const insertNodeAndChildrenInTrie = (
  fullTrie: FullTrie,
  trie: Trie,
  map: MapQueue,
  deepness: number
) => {
  const rawChildren = map.get(trie.identifier)!

  if (!rawChildren) {
    return
  }

  trie.children = []

  fullTrie.totalIndirectOrbits += Math.max(0, deepness - 1)
  for (const rawChild of Array.from(rawChildren)) {
    const subTrie = {
      parent: trie,
      identifier: rawChild,
      indirectOrbits: 0,
      children: []
    }

    trie.children.push(subTrie)

    insertNodeAndChildrenInTrie(fullTrie, subTrie, map, deepness + 1)
  }
}

export const getTrieLength = (trie: Trie): number => {
  return trie.children.reduce((acc, subtrie) => acc + getTrieLength(subtrie), 1)
}

export const getDirectOrbitCounts = (trie: FullTrie) => {
  return Array.from(trie.mapQueue.values()).reduce(
    (acc, item) => acc + item.size,
    0
  )
}

export const getIndirectOrbitCounts = (trie: Trie): number => {
  const secondRanks = trie.children
    .map(firstRanks => firstRanks.children)
    .flat()

  const indirectOrbitsOfInitialNode = secondRanks.reduce(
    (acc, item) => acc + getTrieLength(item),
    0
  )

  const indirectOrbitsOfChildren = trie.children.reduce(
    (acc, item) => acc + getIndirectOrbitCounts(item),
    0
  )

  return indirectOrbitsOfInitialNode + indirectOrbitsOfChildren
}
