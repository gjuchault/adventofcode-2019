import fs from 'fs-extra'
import path from 'path'

import { phaseNTimes } from './fft'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const input = inputString
    .trim()
    .split('')
    .filter(entry => entry && entry.length > 0)
    .map(entry => parseInt(entry, 10))

  const part1 = phaseNTimes(input, [0, 1, 0, -1], 100)

  console.log('[day-16] {part-1}', part1)

  const part2 = 0

  console.log('[day-16] {part-2}', part2)
}

if (require.main === module) {
  main()
}
