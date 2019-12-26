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

  maze.breadthFirstSearch()

  const [oxygenPos, oxygenTile] = maze.findOxygen()
  const pathToOxygen = maze.buildRouteToTile(oxygenTile)
  const part1 = pathToOxygen.length

  console.log('[day-15] {part-1}', part1)

  maze.breadthFirstSearch(pathToOxygen, oxygenPos, oxygenTile)

  const furthestPointFromOxygen = Array.from(maze.map.values()).reduce(
    (acc, tile) => {
      const minutes = maze.buildRouteToTile(tile).length

      return minutes > acc ? minutes : acc
    },
    0
  )

  // as oxygen is our starting point, we added part1 to every route to tile
  const part2 = furthestPointFromOxygen - part1

  console.log('[day-15] {part-2}', part2)
}

if (require.main === module) {
  main()
}
