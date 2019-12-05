import { readInput } from './read'

export type Opcode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 99

export const part1Opcodes: Opcode[] = [1, 2, 3, 4, 99]
export const part2Opcodes: Opcode[] = [1, 2, 3, 4, 5, 6, 7, 8, 99]

export const applyInstructionIntoRegistry = async (
  cursor: number,
  registry: number[],
  opcode: number[],
  params: number[],
  supportedOpcodes: Opcode[]
): Promise<number> => {
  // console.log(
  //   `at cursor ${cursor}, opcode is`,
  //   [
  //     ...opcode.slice(0, -1),
  //     opcode
  //       .slice(-1)
  //       .toString()
  //       .padStart(2, '0')
  //   ],
  //   'and params',
  //   params
  // )

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

      return cursor + 4
    }
    case 2: {
      expectSupportedOpcode(2, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])
      const c = params[2]

      registry[c] = a * b

      return cursor + 4
    }
    case 3: {
      expectSupportedOpcode(3, supportedOpcodes)
      const input = await readInput()
      registry[params[0]] = input
      return cursor + 2
    }
    case 4: {
      expectSupportedOpcode(4, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      console.log(`[output] (param: ${params[0]} in mode ${params[0]}) >`, a)
      return cursor + 2
    }
    case 5: {
      expectSupportedOpcode(5, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])

      return a !== 0 ? b : cursor + 3
    }
    case 6: {
      expectSupportedOpcode(6, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])

      return a === 0 ? b : cursor + 3
    }
    case 7: {
      expectSupportedOpcode(7, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])
      const c = params[2]

      registry[c] = Number(a < b)
      return cursor + 4
    }
    case 8: {
      expectSupportedOpcode(8, supportedOpcodes)
      const a = getForMode(registry, params[0], modesByParam[0])
      const b = getForMode(registry, params[1], modesByParam[1])
      const c = params[2]

      registry[c] = Number(a === b)
      return cursor + 4
    }
    case 99:
      expectSupportedOpcode(99, supportedOpcodes)
      return -1
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
