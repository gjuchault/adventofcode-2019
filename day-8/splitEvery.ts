export const splitEvery = <T>(input: T[], every: number) => {
  const output: T[][] = [[]]

  for (let i = 0; i < input.length; i += 1) {
    if (output[output.length - 1].length < every) {
      output[output.length - 1].push(input[i])

      continue
    }

    output.push([input[i]])
  }

  return output
}
