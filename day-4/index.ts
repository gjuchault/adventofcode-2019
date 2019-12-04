import fs from 'fs-extra'
import path from 'path'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')

  const [start, end] = inputString.split('-').map(n => parseInt(n, 10))

  let part1 = 0

  for (let i = start; i <= end; i += 1) {
    if (canBeAPassword(i)) {
      part1 += 1
    }
  }

  console.log('[day-4] {part-1}', part1)

  let part2 = 0

  for (let i = start; i <= end; i += 1) {
    if (canBeAPassword(i) && canBeAPart2Password(i)) {
      part2 += 1
    }
  }

  console.log('[day-4] {part-2}', part2)
}

const canBeAPassword = (input: number) => {
  if (
    typeof input !== 'number' ||
    !Number.isSafeInteger(input) ||
    input >= 10e5 ||
    input <= 0
  ) {
    return false
  }

  const digits = splitNumberIntoDigits(input)

  const areOnlyIncreasing = digits.reduce((acc, digit, index) => {
    if (index === 0) {
      return true
    }

    return acc && digit >= digits[index - 1]
  }, true)

  if (!areOnlyIncreasing) {
    return false
  }

  const containAdjacentDigits = digits.reduce((acc, digit, index) => {
    if (index === 0) {
      return false
    }

    if (acc) {
      return true
    }

    return digit === digits[index - 1]
  }, false)

  if (!containAdjacentDigits) {
    return false
  }

  return true
}

const canBeAPart2Password = (input: number) => {
  const digits = splitNumberIntoDigits(input)
  const consecutives = Array(digits.length - 1).fill(1)

  for (let i = 0; i <= digits.length; i += 1) {
    if (i === 0) {
      consecutives.push(1)
      continue
    }

    if (digits[i - 1] === digits[i]) {
      consecutives[i] = consecutives[i - 1] + 1
    }
  }

  return consecutives.some((consecutive, index) => {
    // If the number was repeated twice, then we want it to not be 3 next index
    if (consecutive === 2) {
      return index === consecutives.length - 1 || consecutives[index + 1] === 1
    }

    return false
  })
}

const splitNumberIntoDigits = (input: number): number[] => {
  const digits = []

  while (input > 0) {
    digits.push(input % 10)

    input = Math.floor(input / 10)
  }

  return digits.reverse()
}

if (require.main === module) {
  main()
}
