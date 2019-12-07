import fs from 'fs-extra'
import path from 'path'
import { buildTrie, getDirectOrbitCounts, getIndirectOrbitCounts } from './trie'
import { findNode, nodesToTarget } from './traverse'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer
    .toString('utf-8')
    .split('\n')
    .filter(entry => entry && entry.length > 0)

  const fullTrie = await buildTrie(inputString)

  const part1 =
    getDirectOrbitCounts(fullTrie) + getIndirectOrbitCounts(fullTrie)

  console.log('[day-6] {part-1}', part1)

  const YOU = findNode(fullTrie, 'YOU')!
  const SAN = findNode(fullTrie, 'SAN')!
  const part2 = nodesToTarget(YOU, SAN)

  console.log('[day-6] {part-2}', part2)
}

if (require.main === module) {
  main()
}
