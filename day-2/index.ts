import fs from 'fs-extra'
import path from 'path'

type Registry = number[]

const read = (registry: Registry, pos: number) => registry[pos]

const add = (registry: Registry, posA: number, posB: number, posC: number) => {
  registry[posC] = read(registry, posA) + read(registry, posB)
}

const multiply = (
  registry: Registry,
  posA: number,
  posB: number,
  posC: number
) => {
  registry[posC] = read(registry, posA) * read(registry, posB)
}

const processChunk = (
  registry: Registry,
  [opcode, paramA, paramB, paramC]: number[]
) => {
  switch (opcode) {
    case 1:
      add(registry, paramA, paramB, paramC)
      return true
    case 2:
      multiply(registry, paramA, paramB, paramC)
      return true
    case 99:
      return false
    default:
      throw new Error(`Invalid opcode ${opcode}, expecting 1, 2 or 99`)
  }
}

const applyNounAndVerb = (registry: Registry, noun: number, verb: number) => {
  return [registry[0], noun, verb, ...registry.slice(3)]
}

const runIntCode = (input: number[], noun: number, verb: number) => {
  const registry = applyNounAndVerb(input.slice(), noun, verb)

  for (let i = 0; i <= registry.length; i += 4) {
    const shouldContinue = processChunk(registry, [
      registry[i],
      registry[i + 1],
      registry[i + 2],
      registry[i + 3]
    ])

    if (!shouldContinue) {
      break
    }
  }

  return registry[0]
}

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  let input = inputString
    .split(',')
    .filter(entry => entry && entry.length > 0)
    .map(entry => parseInt(entry, 10))

  const part1 = runIntCode(input, 12, 2)

  console.log('[day-2] {part-1}', part1)

  let part2

  for (let noun = 0; noun <= 99; noun += 1) {
    for (let verb = 0; verb <= 99; verb += 1) {
      if (runIntCode(input, noun, verb) === 19690720) {
        part2 = 100 * noun + verb

        // break nested loop
        noun = Infinity
        break
      }
    }
  }

  console.log('[day-2] {part-2}', part2)
}

if (require.main === module) {
  main()
}
