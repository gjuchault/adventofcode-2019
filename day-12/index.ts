import fs from 'fs-extra'
import path from 'path'

import { parseMoon } from './moon'
import { getPairs } from './pairs'
import { nlcm } from './lcm'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const moons = inputString
    .split('\n')
    .filter(entry => entry && entry.length > 0)
    .map(entry => parseMoon(entry))

  const pairs = getPairs(moons)

  const steps = 1000

  for (let i = 0; i < steps; i += 1) {
    for (const [moonA, moonB] of pairs) {
      moonA.applyVelocityFromMoon(moonB)
      moonB.applyVelocityFromMoon(moonA)
    }

    for (const moon of moons) {
      moon.applyVelocityIntoPosition()
    }
  }

  let part1 = 0

  for (const moon of moons) {
    part1 += moon.getEnergy()
  }

  console.log('[day-12] {part-1}', part1)

  for (const moon of moons) {
    moon.reset()
  }

  const results: number[] = []

  for (const axis of ['x', 'y', 'z']) {
    const dimension = { [axis]: true }

    let result = 0

    console.log('dimension', dimension)

    do {
      for (const [moonA, moonB] of pairs) {
        moonA.applyVelocityFromMoon(moonB, dimension)
        moonB.applyVelocityFromMoon(moonA, dimension)
      }

      for (const moon of moons) {
        moon.applyVelocityIntoPosition(dimension)
      }

      let allMoonsAreBackToInitialPos = true

      for (const moon of moons) {
        if (!moon.isBackToInitialPos(dimension)) {
          allMoonsAreBackToInitialPos = false
          break
        }
      }

      result += 1

      if (allMoonsAreBackToInitialPos) {
        break
      }
    } while (1)

    results.push(result)
  }

  const part2 = nlcm(...results)

  console.log('[day-12] {part-2}', part2)
}

if (require.main === module) {
  main()
}
