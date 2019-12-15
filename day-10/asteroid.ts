export type Asteroid = { x: number; y: number }

export const buildAsteroidMap = (input: string[][]) => {
  const asteroids = []

  for (let y = 0; y < input.length; y += 1) {
    const row = input[y]
    for (let x = 0; x < row.length; x += 1) {
      const cell = row[x]
      if (cell === '#') {
        asteroids.push({ x, y })
      }
    }
  }

  return asteroids
}

export const without = (input: Asteroid[], ...items: Asteroid[]) => {
  return input.filter(asteroid => {
    return !items.some(item => asteroid.x === item.x && asteroid.y === item.y)
  })
}
