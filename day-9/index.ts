import fs from 'fs-extra'
import path from 'path'

import { Engine } from './engine'

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

  engine.processUntilHalt(1n)

  const part1 = engine.outputs[0]

  console.log('[day-9] {part-1}', part1)

  const enginePart2 = new Engine(registry)

  enginePart2.processUntilHalt(2n)

  let part2 = enginePart2.outputs[0]

  console.log('[day-9] {part-2}', enginePart2.outputs)
}

if (require.main === module) {
  main()
}
