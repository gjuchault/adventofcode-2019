export const parseOpcode = (opcode: number) => {
  const digits: number[] = Array(5).fill(0)
  const splittedOpcode = splitNumberIntoDigits(opcode)
  const padAmount = 5 - splittedOpcode.length

  for (let i = 0; i < splittedOpcode.length; i += 1) {
    digits[i + padAmount] = splittedOpcode[i]
  }

  // A-B-C for modes, DE is the opcode, so put them backtogether
  return [...digits.slice(0, 3), digits[3] * 10 + digits[4]]
}

const splitNumberIntoDigits = (input: number): number[] => {
  const digits = []

  while (input > 0) {
    digits.push(input % 10)

    input = Math.floor(input / 10)
  }

  return digits.reverse()
}
