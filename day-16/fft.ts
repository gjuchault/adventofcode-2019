export const phase = (input: number[], rawPattern: number[]) => {
  const result = input.slice()

  for (let i = 0; i < input.length; i += 1) {
    const pattern = expandPatternToLength(rawPattern, i + 1, input.length)

    result[i] = applyPattern(input, pattern)
  }

  return result
}

export const phaseNTimes = (
  input: number[],
  rawPattern: number[],
  times: number
) => {
  let result = input.slice()

  let i = times
  while (i > 0) {
    result = phase(result, rawPattern)
    i -= 1
  }

  return result.join('').slice(0, 8)
}

const applyPattern = (input: number[], pattern: number[]) => {
  let result = 0

  for (let i = 0; i < input.length; i += 1) {
    result += input[i] * pattern[i]
  }

  return Math.abs(result) % 10
}

const expandPatternToLength = (
  pattern: number[],
  repeat: number,
  length: number
) => {
  let result = []

  // expand each item of pattern
  for (let i = 0; i < pattern.length; i += 1) {
    const element = pattern[i]

    result.push(...Array(repeat).fill(element))
  }

  // remove the first element
  // repeat to have length
  while (result.length < length + 1) {
    result = [...result, ...result]
  }

  result = result.slice(1, length + 1)

  return result
}
