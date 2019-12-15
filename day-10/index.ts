import fs from 'fs-extra'
import path from 'path'

import { buildAsteroidMap } from './asteroid'
import { getNumberOfAsteroidsInSight } from './lineOfSight'
import { getAsteroidDestroyedByLaser } from './laser'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const input = inputString
    .split('\n')
    .filter(entry => entry && entry.length > 0)
    .map(row => row.split(''))

  const asteroids = buildAsteroidMap(input)

  let part1 = 0
  let instantMonitoringStationAsteroid

  for (const asteroid of asteroids) {
    let score = getNumberOfAsteroidsInSight(asteroid, asteroids)

    if (score > part1) {
      instantMonitoringStationAsteroid = asteroid
      part1 = score
    }
  }

  console.log(
    '[day-10] {part-1}',
    part1,
    'at',
    instantMonitoringStationAsteroid
  )

  if (!instantMonitoringStationAsteroid) return

  const nthDestroyedAsteroid = getAsteroidDestroyedByLaser(
    instantMonitoringStationAsteroid,
    asteroids.slice(),
    200
  )

  const part2 = nthDestroyedAsteroid.x * 100 + nthDestroyedAsteroid.y

  console.log('[day-10] {part-2}', part2)
}

if (require.main === module) {
  main()
}
