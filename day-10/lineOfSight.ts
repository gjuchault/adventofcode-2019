import { Asteroid, without } from './asteroid'

export const getNumberOfAsteroidsInSight = (
  asteroid: Asteroid,
  asteroids: Asteroid[]
) => {
  let numberOfAsteroidsInSight = 0

  for (const target of without(asteroids, asteroid)) {
    const possibleBreakers = without(asteroids, asteroid, target)

    if (isInSight(asteroid, target, possibleBreakers)) {
      numberOfAsteroidsInSight += 1
    }
  }

  return numberOfAsteroidsInSight
}

const isInSight = (a: Asteroid, b: Asteroid, asteroids: Asteroid[]) => {
  const path = getPath(a, b)

  for (const { x, y } of path) {
    const isThereAnAsteroidOnThisPath = asteroids.some(
      asteroid => asteroid.x === x && asteroid.y === y
    )

    if (isThereAnAsteroidOnThisPath) {
      return false
    }
  }

  return true
}

const getPath = (from: Asteroid, to: Asteroid) => {
  const path = []

  const x = Math.abs(to.x - from.x)
  const y = Math.abs(to.y - from.y)

  // repeat the smallest repeatable path between the two points
  const smallestPath = gcd(x, y)

  // ie. from (0, 0) to (2, 4), the smallest path chunk is (1, 2) repeated
  // twice
  const xStep = x / smallestPath
  const yStep = y / smallestPath

  const { dx, dy } = getDeltas(from, to)

  for (let i = 1; i < smallestPath; i++) {
    path.push({
      x: Math.round(from.x + dx * i * xStep),
      y: Math.round(from.y + dy * i * yStep)
    })
  }

  return path
}

const gcd = (a: number, b: number): number => {
  return b ? gcd(b, a % b) : Math.abs(a)
}

const getDeltas = (from: Asteroid, to: Asteroid) => {
  if (from.x >= to.x && from.y >= to.y) return { dx: -1, dy: -1 }
  else if (from.x >= to.x && from.y <= to.y) return { dx: -1, dy: 1 }
  else if (from.x <= to.x && from.y >= to.y) return { dx: 1, dy: -1 }

  return { dx: 1, dy: 1 }
}
