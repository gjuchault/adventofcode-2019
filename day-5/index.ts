import fs from 'fs-extra'
import path from 'path'

import {
  applyInstructionIntoRegistry,
  Opcode,
  part1Opcodes,
  part2Opcodes
} from './instruction'
import { parseOpcode } from './opcode'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const registry = inputString
    .split(',')
    .filter(entry => entry && entry.length > 0)
    .map(entry => parseInt(entry, 10))

  await processRegsitry(registry.slice(), part1Opcodes)

  console.log('[day-5] {part-1} Answer was the last output before halt')

  await processRegsitry(registry.slice(), part2Opcodes)

  console.log('[day-5] {part-2} Answer was the last output before halt')

  process.exit(0)
}

const processRegsitry = async (registry: number[], opcodes: Opcode[]) => {
  let isRunning = true
  let cursor = 0

  do {
    const opcode = parseOpcode(registry[cursor])

    const nextInstructionCursor = await applyInstructionIntoRegistry(
      cursor,
      registry,
      opcode,
      registry.slice(cursor + 1, cursor + 4),
      opcodes
    )

    if (nextInstructionCursor === -1) {
      break
    }

    cursor = nextInstructionCursor
  } while (isRunning)
}

if (require.main === module) {
  main()
}
