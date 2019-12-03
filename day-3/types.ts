export type Point = {
  x: number
  y: number
}

export type Grid = Map<string, Set<string>>

export type Operation = (point: Point) => void
