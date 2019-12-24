import fs from 'fs-extra'
import path from 'path'

import { buildBaker } from './baker'
import { adjust } from './adjust'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const input = inputString
    .split('\n')
    .filter(entry => entry && entry.length > 0)

  const baker = buildBaker(input)

  const part1 = baker.getOreFor('FUEL', 1000)

  console.log('[day-14] {part-1}', part1)

  const availableOre = 1e12
  const oneFuelOreCost = part1

  const fuelEstimation = Math.round(availableOre / oneFuelOreCost)

  const { param, result } = adjust(
    availableOre,
    (param: number) => baker.reset().getOreFor('FUEL', param),
    {
      param: fuelEstimation,
      result: baker.reset().getOreFor('FUEL', fuelEstimation)
    }
  )

  const part2 = { param, result }
  console.log('[day-14] {part-2}', part2)
}

if (require.main === module) {
  main()
}
