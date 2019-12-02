import fs from 'fs-extra'
import path from 'path'

const getFuel = (input: number) => Math.floor(input / 3) - 2

const getExtendedFuel = (input: number) => {
  let initialFuel = getFuel(input)

  let fuelNeeded = initialFuel
  while (fuelNeeded > 0) {
    const fuelNeededForThisLayer = getFuel(fuelNeeded)

    if (fuelNeededForThisLayer <= 0) {
      break
    }

    initialFuel += fuelNeededForThisLayer

    fuelNeeded = fuelNeededForThisLayer
  }

  return initialFuel
}

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const input = inputString
    .split('\n')
    .filter(entry => entry && entry.length > 0)
    .map(entry => parseInt(entry, 10))

  const part1 = input.reduce((acc, entry) => acc + getFuel(entry), 0)

  console.log('[day-1] {part-1}', part1)

  const part2 = input.reduce((acc, entry) => acc + getExtendedFuel(entry), 0)

  console.log('[day-1] {part-2}', part2)
}

if (require.main === module) {
  main()
}
