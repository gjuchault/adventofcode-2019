import fs from 'fs-extra'
import path from 'path'
import { Engine } from './engine'
import { Scaffold } from './scaffold'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const registry = new Map(
    inputString
      .split(',')
      .filter(entry => entry && entry.length > 0)
      .map((entry, i) => [BigInt(i), BigInt(entry)])
  )

  const engine = new Engine(registry)
  const scaffold = new Scaffold()

  engine.processUntilHalt()

  scaffold.feed(engine.outputs)

  scaffold.saveToFile()
  const intersections = scaffold.findIntersections()

  const part1 = intersections.map(([x, y]) => x * y).reduce((a, b) => a + b, 0)

  console.log('[day-17] {part-1}', part1)

  const part2 = 0

  console.log('[day-17] {part-2}', part2)
}

if (require.main === module) {
  main()
}
