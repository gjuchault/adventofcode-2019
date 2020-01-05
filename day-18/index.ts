import fs from 'fs-extra'
import path from 'path'

import { buildGraph } from './graph'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const input = inputString
    .split('\n')
    .filter(entry => entry && entry.length > 0)

  // 1 - parse map
  const graph = buildGraph(input)
  console.log(graph)
  // 2 - list points, doors and self
  // 3 - from self, tag available keys and doors
  // 4 - from each doors, tag available keys and doors
  // 5 - do that until the end
  // 6 - we now have a graph of available keys and doors
  // 7 -

  const part1 = 0

  console.log('[day-1] {part-1}', part1)

  const part2 = 0

  console.log('[day-1] {part-2}', part2)
}

if (require.main === module) {
  main()
}
