export const groupByWith = <K, T>(
  iterable: Iterable<T>,
  iteratee: (value: T) => K
): Map<K, T[]> => {
  const groups = new Map<K, T[]>()
  for (const value of iterable) {
    const key = iteratee(value)
    let group = groups.get(key)
    if (!group) {
      group = []
      groups.set(key, group)
    }
    group.push(value)
  }
  return groups
}
