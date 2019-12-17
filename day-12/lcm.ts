export const gcd = (a: number, b: number): number => {
  return b ? gcd(b, a % b) : Math.abs(a)
}

export const lcm = (a: number, b: number) => {
  return Math.abs(a * b) / gcd(a, b)
}

export const nlcm = (...input: number[]) => {
  return input.reduce((acc, input) => {
    return lcm(acc, input)
  }, 1)
}
