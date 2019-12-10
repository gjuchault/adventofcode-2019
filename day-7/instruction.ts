export type Opcode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 99

type InputOutput = {
  type: 'input'
  nextCursor: number
}

type NextOutput = {
  type: 'next'
  nextCursor: number
}

type OutputOutput = {
  type: 'output'
  output: number
  nextCursor: number
}

type HaltOutput = {
  type: 'halt'
}

export type Output = InputOutput | NextOutput | OutputOutput | HaltOutput

export const part1Opcodes: Opcode[] = [1, 2, 3, 4, 99]
export const part2Opcodes: Opcode[] = [1, 2, 3, 4, 5, 6, 7, 8, 99]

export const applyInstructionIntoRegistry = (
  cursor: number,
  registry: number[],
  opcode: number[],
  params: number[],
  supportedOpcodes: Opcode[],
  onInput: () => number
): Output => {
  if (opcode.length !== 4) {
    throw new Error(`Invalid opcode: ${opcode}`)
  }

  // ABCDE, C is mode for param 0 --> A is mode for param 2
  const modesByParam = opcode.slice(0, 3).reverse()

  switch (opcode[3]) {
    case 1: {
      expectSupportedOpcode(1, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])
      const c = params[2]

      registry[c] = a + b

      return {
        type: 'next',
        nextCursor: cursor + 4
      }
    }
    case 2: {
      expectSupportedOpcode(2, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])
      const c = params[2]

      registry[c] = a * b

      return {
        type: 'next',
        nextCursor: cursor + 4
      }
    }
    case 3: {
      expectSupportedOpcode(3, supportedOpcodes)

      registry[params[0]] = onInput()

      return {
        type: 'input',
        nextCursor: cursor + 2
      }
    }
    case 4: {
      expectSupportedOpcode(4, supportedOpcodes)
      const output = getForMode(registry, params[0], modesByParam[0])

      return {
        type: 'output',
        output,
        nextCursor: cursor + 2
      }
    }
    case 5: {
      expectSupportedOpcode(5, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])

      return {
        type: 'next',
        nextCursor: a !== 0 ? b : cursor + 3
      }
    }
    case 6: {
      expectSupportedOpcode(6, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])

      return {
        type: 'next',
        nextCursor: a === 0 ? b : cursor + 3
      }
    }
    case 7: {
      expectSupportedOpcode(7, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])
      const c = params[2]

      registry[c] = Number(a < b)

      return {
        type: 'next',
        nextCursor: cursor + 4
      }
    }
    case 8: {
      expectSupportedOpcode(8, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])
      const c = params[2]

      registry[c] = Number(a === b)

      return {
        type: 'next',
        nextCursor: cursor + 4
      }
    }
    case 99:
      expectSupportedOpcode(99, supportedOpcodes)

      return {
        type: 'halt'
      }
    default:
      throw new Error(`Invalid opcode: ${opcode}`)
  }
}

const getForMode = (registry: number[], input: number, mode: number) => {
  if (mode !== 0 && mode !== 1) {
    throw new Error(`Invalid mode ${mode}`)
  }

  return mode === 0 ? registry[input] : input
}

const expectSupportedOpcode = (opcode: any, supportedOpcodes: Opcode[]) => {
  if (supportedOpcodes.indexOf(opcode) === -1) {
    throw new Error(
      `Invalid opcode ${opcode} (supported opcodes: ${supportedOpcodes.join(
        ','
      )})`
    )
  }
}
