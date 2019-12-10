import fs from 'fs-extra'
import path from 'path'

import { getAllPermutations } from './combinations'
import { Engine } from './engine'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')
  const registry = inputString
    .split(',')
    .filter(entry => entry && entry.length > 0)
    .map(entry => parseInt(entry, 10))

  let part1 = -1

  let combinations = getAllPermutations([0, 1, 2, 3, 4])

  for (const combination of combinations) {
    const [pA, pB, pC, pD, pE] = combination

    const A = new Engine(registry)
    const B = new Engine(registry)
    const C = new Engine(registry)
    const D = new Engine(registry)
    const E = new Engine(registry)

    const resA = A.processUntilOutput(pA, 0)
    const resB = B.processUntilOutput(pB, resA.output)
    const resC = C.processUntilOutput(pC, resB.output)
    const resD = D.processUntilOutput(pD, resC.output)
    const resE = E.processUntilOutput(pE, resD.output)

    if (resE.output > part1) {
      part1 = resE.output
    }
  }

  console.log('[day-7] {part-1}', part1)

  let part2 = -1

  combinations = getAllPermutations([5, 6, 7, 8, 9])

  for (const combination of combinations) {
    const [pA, pB, pC, pD, pE] = combination

    let outputE = 0
    let firstRun = true

    const A = new Engine(registry)
    const B = new Engine(registry)
    const C = new Engine(registry)
    const D = new Engine(registry)
    const E = new Engine(registry)

    while (1) {
      let resA, resB, resC, resD, resE

      if (firstRun) {
        resA = A.processUntilOutput(pA, 0)
        resB = B.processUntilOutput(pB, resA.output)
        resC = C.processUntilOutput(pC, resB.output)
        resD = D.processUntilOutput(pD, resC.output)
        resE = E.processUntilOutput(pE, resD.output)
      } else {
        resA = A.processUntilOutput(outputE)
        resB = B.processUntilOutput(resA.output)
        resC = C.processUntilOutput(resB.output)
        resD = D.processUntilOutput(resC.output)
        resE = E.processUntilOutput(resD.output)
      }

      firstRun = false

      outputE = resE.output

      if (
        resA.halted ||
        resB.halted ||
        resC.halted ||
        resD.halted ||
        resE.halted
      ) {
        break
      }
    }

    if (outputE > part2) {
      part2 = outputE
    }
  }

  console.log('[day-7] {part-2}', part2)
}

if (require.main === module) {
  main()
}
