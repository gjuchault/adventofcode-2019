import { parseOpcode } from './opcode'

export class Engine {
  registry: Map<bigint, bigint>
  cursor: bigint
  inputs: bigint[]
  currentInputIndex: number
  relativeBase: bigint
  outputs: bigint[]

  constructor(
    registry: Map<bigint, bigint>,
    cursor: bigint = 0n,
    relativeBase: bigint = 0n
  ) {
    this.registry = new Map(registry)
    this.cursor = cursor
    this.inputs = []
    this.currentInputIndex = 0
    this.outputs = []
    this.relativeBase = relativeBase
  }

  processUntil(
    event: 'halt' | 'input' | 'output' | 'next',
    ...nextInputs: bigint[]
  ) {
    this.inputs.push(...nextInputs)

    let halted = false

    while (1) {
      const opcode = parseOpcode(Number(this.registry.get(this.cursor)))

      const result = this.applyInstructionIntoRegistry(opcode, [
        this.registry.get(this.cursor + 1n) || 0n,
        this.registry.get(this.cursor + 2n) || 0n,
        this.registry.get(this.cursor + 3n) || 0n,
        this.registry.get(this.cursor + 4n) || 0n
      ])

      if (result === 'halt') {
        halted = true
        break
      }

      if (result === event) {
        break
      }
    }

    return { output: this.outputs, halted }
  }

  processUntilOutput(...nextInputs: bigint[]) {
    return this.processUntil('output', ...nextInputs)
  }

  processUntilHalt(...nextInputs: bigint[]) {
    return this.processUntil('halt', ...nextInputs)
  }

  getNextInput() {
    let value = this.inputs[this.currentInputIndex]

    this.currentInputIndex += 1

    return value
  }

  enforceOneNextInput(value: bigint) {
    this.inputs = [value]
    this.currentInputIndex = 0
  }

  getLastOutput() {
    return this.outputs[this.outputs.length - 1]
  }

  applyInstructionIntoRegistry(opcode: number[], params: bigint[]) {
    if (opcode.length !== 4) {
      throw new Error(`Invalid opcode: ${opcode}`)
    }

    // ABCDE, C is mode for param 0 --> A is mode for param 2
    const modes = opcode.slice(0, 3).reverse()

    switch (opcode[3]) {
      case 1: {
        const a = this.getForMode('read', params[0], modes[0])
        const b = this.getForMode('read', params[1], modes[1])
        const c = this.getForMode('write', params[2], modes[2])

        this.registry.set(c, a + b)
        this.cursor += 4n

        return 'next'
      }
      case 2: {
        const a = this.getForMode('read', params[0], modes[0])
        const b = this.getForMode('read', params[1], modes[1])
        const c = this.getForMode('write', params[2], modes[2])

        this.registry.set(c, a * b)
        this.cursor += 4n

        return 'next'
      }
      case 3: {
        const index = this.getForMode('write', params[0], modes[0])

        const input = this.getNextInput()

        this.registry.set(index, input)
        this.cursor += 2n

        return 'input'
      }
      case 4: {
        const output = this.getForMode('read', params[0], modes[0])

        this.outputs.push(output)
        this.cursor += 2n

        return 'output'
      }
      case 5: {
        const a = this.getForMode('read', params[0], modes[0])
        const b = this.getForMode('read', params[1], modes[1])

        this.cursor = a !== 0n ? b : this.cursor + 3n

        return 'next'
      }
      case 6: {
        const a = this.getForMode('read', params[0], modes[0])
        const b = this.getForMode('read', params[1], modes[1])

        this.cursor = a === 0n ? b : this.cursor + 3n

        return 'next'
      }
      case 7: {
        const a = this.getForMode('read', params[0], modes[0])
        const b = this.getForMode('read', params[1], modes[1])
        const c = this.getForMode('write', params[2], modes[2])

        this.registry.set(c, a < b ? 1n : 0n)
        this.cursor += 4n

        return 'next'
      }
      case 8: {
        const a = this.getForMode('read', params[0], modes[0])
        const b = this.getForMode('read', params[1], modes[1])
        const c = this.getForMode('write', params[2], modes[2])

        this.registry.set(c, a === b ? 1n : 0n)
        this.cursor += 4n

        return 'next'
      }
      case 9: {
        const delta = this.getForMode('read', params[0], modes[0])

        this.relativeBase += delta
        this.cursor += 2n

        return 'next'
      }
      case 99:
        return 'halt'
      default:
        throw new Error(`Invalid opcode: ${opcode}`)
    }
  }

  getForMode(type: 'read' | 'write', param: bigint, mode: number) {
    if (![0, 1, 2].includes(mode)) {
      throw new Error(`Invalid mode ${mode}`)
    }

    if (type === 'write') {
      if (mode === 2) {
        return param + this.relativeBase
      }

      return param
    }

    switch (mode) {
      // position mode
      default:
      case 0:
        return this.registry.get(param) || 0n
      // immediate mode
      case 1:
        return param
      case 2:
        return this.registry.get(param + this.relativeBase) || 0n
    }
  }
}
