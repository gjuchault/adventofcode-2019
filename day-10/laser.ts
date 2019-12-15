import { Asteroid } from './asteroid'
import { groupByWith } from './groupBy'

export type PolarAsteroid = {
  r: number
  theta: number
  initialPos: Asteroid
  destroyed: boolean
}

export const getAsteroidDestroyedByLaser = (
  asteroid: Asteroid,
  asteroids: Asteroid[],
  at: number
) => {
  const polarAsteroids = asteroids
    .filter(({ x, y }) => x !== asteroid.x || y !== asteroid.y)
    .map(target => convertToPolarAsteroid(target, asteroid))
    .sort((left: PolarAsteroid, right: PolarAsteroid) => {
      // first sort by closest to 0°
      const deltaTheta = left.theta - right.theta

      // if same delta, sort by closest distance
      if (deltaTheta === 0) {
        return left.r - right.r
      }

      return deltaTheta
    })

  const asteroidsByAngle = groupByWith(polarAsteroids, ({ theta }) => theta)

  const allAngles = Array.from(asteroidsByAngle.keys()).sort()

  let currentlyAt = 0
  let currentAngle = 0
  let polarShotAt

  while (currentlyAt !== at) {
    const asteroidsInAngle = asteroidsByAngle.get(allAngles[currentAngle])

    if (!asteroidsInAngle) {
      continue
    }

    currentAngle = (currentAngle + 1) % allAngles.length

    const { hasShot, asteroid } = shootFirstOfArray(asteroidsInAngle!)

    if (hasShot) {
      polarShotAt = asteroid
    }

    currentlyAt += Number(hasShot)
  }

  if (!polarShotAt) {
    throw new Error('At is bigger than the number of asteroids')
  }

  return polarShotAt.initialPos
}

const convertToPolarAsteroid = (
  coords: Asteroid,
  center: Asteroid
): PolarAsteroid => {
  const x = coords.x - center.x
  const y = -1 * (coords.y - center.y)
  const r = Math.sqrt(x ** 2 + y ** 2)

  if (Math.abs(x) === 0 && Math.abs(y) === 0) {
    return { r: 0, theta: 0, initialPos: coords, destroyed: false }
  }

  const rawAtan2 = Math.atan2(x, y)
  const theta = rawAtan2 < 0 ? 2 * Math.PI + rawAtan2 : rawAtan2

  return {
    r,
    theta,
    initialPos: coords,
    destroyed: false
  }
}

const shootFirstOfArray = (asteroids: PolarAsteroid[]) => {
  for (const asteroid of asteroids) {
    if (!asteroid.destroyed) {
      asteroid.destroyed = true
      return { hasShot: true, asteroid }
    }
  }

  return { hasShot: false }
}
