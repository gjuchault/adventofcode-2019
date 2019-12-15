import fs from 'fs-extra'
import path from 'path'

import { Robot, Color } from './robot'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const registry = new Map(
    inputString
      .split(',')
      .filter(entry => entry && entry.length > 0)
      .map((entry, i) => [BigInt(i), BigInt(entry)])
  )

  const robot = new Robot(registry)

  robot.process()

  const part1 = robot.grid.size

  console.log('[day-11] {part-1}', part1)

  const robot2 = new Robot(new Map(registry), Color.White)

  robot2.process()

  const allPos = Array.from(robot2.grid.keys()).map(pos => pos.split(','))

  const allX = allPos.map(([x, y]) => Number(x))
  const allY = allPos.map(([x, y]) => Number(y))

  const minX = Math.min(...allX)
  const maxX = Math.max(...allX)
  const minY = Math.min(...allY)
  const maxY = Math.max(...allY)

  for (let i = minX; i <= maxX; i += 1) {
    for (let j = minY; j <= maxY; j += 1) {
      process.stdout.write(
        robot2.grid.get(`${i},${j}`) === Color.Black ? ' ' : '#'
      )
    }

    process.stdout.write('\n')
  }
}

if (require.main === module) {
  main()
}
