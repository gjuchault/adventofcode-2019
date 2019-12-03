import { Grid, Point, Operation } from './types'

export const pointToKey = (point: Point) => `${point.x}:${point.y}`

export const keyToPoint = (key: string) => {
  const pos = key.split(':').map(n => parseInt(n, 10))

  return {
    x: pos[0],
    y: pos[1]
  }
}

export const setPointInGrid = (grid: Grid, point: Point, id: string) => {
  const key = pointToKey(point)

  if (!grid.has(key)) {
    grid.set(key, new Set([id]))
  } else {
    const currentPathsOnPoints = grid.get(key)!

    currentPathsOnPoints.add(id)
  }
}

export const getManhatthanDistance = (point: Point) =>
  Math.abs(point.x) + Math.abs(point.y)

export const traversePath = (path: string, onPoint: Operation) => {
  const instructions = path.split(',')

  let point: Point = { x: 0, y: 0 }

  onPoint(point)

  for (const instruction of instructions) {
    const direction = instruction.slice(0, 1)
    const amount = parseInt(instruction.slice(1), 10)

    if (direction === 'U') {
      for (let i = 1; i <= amount; i += 1) {
        onPoint({ x: point.x, y: point.y + i })
      }

      point = { x: point.x, y: point.y + amount }
    }

    if (direction === 'R') {
      for (let i = 1; i <= amount; i += 1) {
        onPoint({ x: point.x + i, y: point.y })
      }

      point = { x: point.x + amount, y: point.y }
    }

    if (direction === 'D') {
      for (let i = 1; i <= amount; i += 1) {
        onPoint({ x: point.x, y: point.y - i })
      }

      point = { x: point.x, y: point.y - amount }
    }

    if (direction === 'L') {
      for (let i = 1; i <= amount; i += 1) {
        onPoint({ x: point.x - i, y: point.y })
      }

      point = { x: point.x - amount, y: point.y }
    }
  }
}
