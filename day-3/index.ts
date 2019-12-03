import fs from 'fs-extra'
import path from 'path'

import { Grid, Point } from './types'
import { traversePath, setPointInGrid, getManhatthanDistance } from './grid'
import { findIntersections } from './intersections'

const main = async () => {
  const inputBuffer = await fs.readFile(path.join(__dirname, 'input.txt'))
  const inputString = inputBuffer.toString('utf-8')

  const paths = inputString.split('\n')

  const grid: Grid = new Map<string, Set<string>>()

  // initial grid filling with paths
  let pathCount = 1
  for (let path of paths) {
    const id = `path-${pathCount}`

    pathCount += 1

    traversePath(path, (point: Point) => {
      setPointInGrid(grid, point, id)
    })
  }

  const intersections = findIntersections(grid)

  // part 1: find the closest intersection to (0,0)
  const closestIntersectionToZero = Math.min(
    ...intersections.map(intersection => getManhatthanDistance(intersection))
  )

  console.log('[day-3] {part-1}', closestIntersectionToZero)

  // part 2: find the closest intersection by sum of path score sum
  let closestIntersectionByPathScoreSum = Number.POSITIVE_INFINITY

  for (let intersection of intersections) {
    let intersectionScore = 0

    for (let path of paths) {
      let intersectionFound = false

      traversePath(path, (point: Point) => {
        if (intersectionFound) {
          return
        }

        if (point.x !== intersection.x || point.y !== intersection.y) {
          intersectionScore += 1
          return
        }

        // only the intersection survived
        intersectionFound = true
      })
    }

    if (intersectionScore < closestIntersectionByPathScoreSum) {
      closestIntersectionByPathScoreSum = intersectionScore
    }
  }

  console.log('[day-3] {part-2}', closestIntersectionByPathScoreSum)
}

if (require.main === module) {
  main()
}
