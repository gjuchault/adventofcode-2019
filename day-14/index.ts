import fs from 'fs-extra'
import path from 'path'

import { buildBaker } from './baker'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const input = inputString
    .split('\n')
    .filter(entry => entry && entry.length > 0)

  const baker = buildBaker(input)

  const part1 = baker.getOreFor('FUEL')

  console.log('[day-14] {part-1}', part1)

  const part2 = 0

  console.log('[day-14] {part-2}', part2)
}

if (require.main === module) {
  main()
}
