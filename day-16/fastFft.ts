export const fastPhaserNTimes = (input: number[], times: number) => {
  const offset = parseInt(input.slice(0, 7).join(''), 10)

  // cut the first digits, we won't use them
  let result = input.slice(offset)

  let i = times
  while (i--) {
    result = fastPhaser(result)
  }

  return result.slice(0, 8).join('')
}

const fastPhaser = (input: number[]) => {
  let result = input.slice()

  // if the offset is big enough, then the pattern is simply 1, 1, 1, 1, ...
  for (let i = result.length - 1; i >= 0; i -= 1) {
    result[i] =
      (i === result.length - 1 ? result[i] : result[i + 1] + result[i]) % 10
  }

  return result
}
