import { parseOpcode } from './opcode'
import { applyInstructionIntoRegistry, part2Opcodes } from './instruction'

export class Engine {
  registry: number[]
  cursor: number
  inputs: number[]
  currentInputIndex: number
  lastOutput: number

  constructor(registry: number[], cursor: number = 0) {
    this.registry = registry.slice()
    this.cursor = cursor
    this.inputs = []
    this.currentInputIndex = 0
    this.lastOutput = -1
  }

  processUntilOutput(...nextInputs: number[]) {
    this.inputs.push(...nextInputs)

    let halted = false

    while (1) {
      const opcode = parseOpcode(this.registry[this.cursor])

      const result = applyInstructionIntoRegistry(
        this.cursor,
        this.registry,
        opcode,
        this.registry.slice(this.cursor + 1, this.cursor + 4),
        part2Opcodes,
        () => {
          let value = this.inputs[this.currentInputIndex]

          this.currentInputIndex += 1

          return value
        }
      )

      if (result.type === 'halt') {
        halted = true
        break
      }

      this.cursor = result.nextCursor

      if (result.type === 'output') {
        this.lastOutput = result.output
        break
      }
    }

    return { output: this.lastOutput, halted }
  }
}
