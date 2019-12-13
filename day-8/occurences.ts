export const occurences = <T>(input: T[], compareTo: T) => {
  let result = 0

  for (const item of input) {
    if (item === compareTo) {
      result += 1
    }
  }

  return result
}
