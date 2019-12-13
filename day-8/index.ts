import fs from 'fs-extra'
import path from 'path'

import { splitEvery } from './splitEvery'
import { occurences } from './occurences'
import { composeColors } from './composeColors'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer
    .toString('utf-8')
    .split('\n')
    .filter(entry => entry && entry.length > 0)

  const width = 25
  const height = 6
  const layers = splitEvery(
    inputString[0].split('').map(n => parseInt(n, 10)),
    width * height
  )

  let layersWithLeastZeros = Array(width).fill(0)

  for (const layer of layers) {
    if (occurences(layer, 0) < occurences(layersWithLeastZeros, 0)) {
      layersWithLeastZeros = layer
    }
  }

  const part1 =
    occurences(layersWithLeastZeros, 1) * occurences(layersWithLeastZeros, 2)

  console.log('[day-8] {part-1}', part1)

  const decodedImage = Array(width * height).fill(2)

  for (let i = 0; i < decodedImage.length; i += 1) {
    const pixel = composeColors(...layers.map(layer => layer[i]).reverse())

    decodedImage[i] = pixel
  }

  const part2 = splitEvery(
    decodedImage.map(color => {
      return color === 1 ? '█' : ' '
    }),
    width
  )
    .map(line => line.join(''))
    .join('\n')

  console.log('[day-8] {part-2}')
  console.log(part2)
}

if (require.main === module) {
  main()
}
