import { Grid, Point } from './types'
import { keyToPoint } from './grid'

export const findIntersections = (grid: Grid): Point[] => {
  return Array.from(grid.entries())
    .filter(([key, paths]) => paths.size >= 2)
    .map(([key]) => keyToPoint(key))
    .filter(point => point.x !== 0 && point.y !== 0)
}
