// https://initjs.org/all-permutations-of-a-set-f1be174c79f8
const _getAllPermutations = (input: string): string[] => {
  let results = []
  if (input.length === 1) {
    results.push(input)
    return results
  }

  for (let i = 0; i < input.length; i += 1) {
    let firstChar = input[i]
    let charsLeft = input.substring(0, i) + input.substring(i + 1)
    let innerPermutations = _getAllPermutations(charsLeft)
    for (let j = 0; j < innerPermutations.length; j += 1) {
      results.push(firstChar + innerPermutations[j])
    }
  }
  return results
}

export const getAllPermutations = (input: number[]) => {
  const perms = _getAllPermutations(input.join(''))

  return perms.map(perm => perm.split('').map(digit => parseInt(digit, 10)))
}
