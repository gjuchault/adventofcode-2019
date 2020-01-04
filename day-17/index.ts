import fs from 'fs-extra'
import path from 'path'
import { Engine } from './engine'
import { Scaffold } from './scaffold'
import { findThreeSequences, buildInput } from './sequence'

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
  const { route, intersections } = scaffold.walksOnScaffold()

  const part1 = intersections.map(([x, y]) => x * y).reduce((a, b) => a + b, 0)

  console.log('[day-17] {part-1}', part1)

  const { functions, mainRoutine } = findThreeSequences(route.join(''))

  const intcodeInput = buildInput(functions, mainRoutine)

  const registryPart2 = new Map(registry)
  registryPart2.set(0n, 2n)
  const enginePart2 = new Engine(registryPart2)
  enginePart2.processUntilHalt(...intcodeInput.map(BigInt))

  const part2 = enginePart2.getLastOutput()

  console.log('[day-17] {part-2}', part2)
}

if (require.main === module) {
  main()
}
