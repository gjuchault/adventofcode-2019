import fs from 'fs-extra'
import path from 'path'

import { Maze } from './maze'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const registry = new Map(
    inputString
      .split(',')
      .filter(entry => entry && entry.length > 0)
      .map((entry, i) => [BigInt(i), BigInt(entry)])
  )

  const maze = new Maze(registry)

  const route = maze.findOxygen()

  const part1 = route!.length

  console.log('[day-15] {part-1}', part1)

  const part2 = 0

  console.log('[day-15] {part-2}', part2)
}

if (require.main === module) {
  main()
}
