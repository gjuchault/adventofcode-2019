export const getPairs = <T>(items: T[]): T[][] => {
  const pairs: T[][] = []

  // for each item
  for (let i = 0; i < items.length; i += 1) {
    // take remaining items
    for (let j = i + 1; j < items.length; j += 1) {
      pairs.push([items[i], items[j]])
    }
  }

  return pairs
}
