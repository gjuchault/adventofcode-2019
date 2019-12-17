import fs from 'fs-extra'
import path from 'path'

import { Engine } from './engine'
import { ArcaneCabinet, Tile } from './arcaneCabinet'
import { findBestJoystick } from './arcanePlayer'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const SHOW_GAME = false

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const registry = new Map(
    inputString
      .split(',')
      .filter(entry => entry && entry.length > 0)
      .map((entry, i) => [BigInt(i), BigInt(entry)])
  )

  const arcaneCabinet = new ArcaneCabinet()
  const engine = new Engine(registry)

  while (1) {
    engine.processUntilOutput()
    const x = engine.getLastOutput()

    engine.processUntilOutput()
    const y = engine.getLastOutput()

    const { halted } = engine.processUntilOutput()
    const tile = engine.getLastOutput()

    arcaneCabinet.setTile(x, y, tile)

    if (SHOW_GAME) arcaneCabinet.render()

    if (halted) {
      break
    }
  }

  const part1 = Array.from(arcaneCabinet.grid.values()).filter(
    tile => tile === Tile.Block
  ).length

  const registryPart2 = new Map(registry)

  // free game
  registryPart2.set(0n, 2n)

  const arcaneCabinetPart2 = new ArcaneCabinet()
  const enginePart2 = new Engine(registryPart2)

  if (SHOW_GAME) arcaneCabinetPart2.consoleClear()

  while (1) {
    enginePart2.enforceOneNextInput(findBestJoystick(arcaneCabinetPart2))

    const { halted: h1 } = enginePart2.processUntilOutput()
    const x = enginePart2.getLastOutput()

    const { halted: h2 } = enginePart2.processUntilOutput()
    const y = enginePart2.getLastOutput()

    const { halted: h3 } = enginePart2.processUntilOutput()
    const tile = enginePart2.getLastOutput()

    arcaneCabinetPart2.setTile(x, y, tile)

    if (SHOW_GAME) arcaneCabinetPart2.render()

    if (h1 || h2 || h3) {
      break
    }

    if (SHOW_GAME && arcaneCabinetPart2.paddleX) {
      await sleep(16)
    }
  }

  const part2 = arcaneCabinetPart2.score

  console.log('[day-13] {part-1}', part1)
  console.log('[day-13] {part-2}', part2)
}

if (require.main === module) {
  main()
}
