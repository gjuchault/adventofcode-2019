import { Engine } from './engine'
import { buildDirection, Direction } from './direction'

export type Grid = Map<string, Color>

export type Position = {
  x: bigint
  y: bigint
}

export enum Color {
  Black = '.',
  White = '#'
}

const directions = {
  up: [0, 1],
  right: [1, 0],
  down: [0, -1],
  left: [-1, 0]
}

export class Robot {
  engine: Engine
  grid: Grid
  position: Position
  direction: Direction
  defaultColor: Color

  constructor(
    registry: Map<bigint, bigint>,
    defaultColor: Color = Color.Black
  ) {
    this.engine = new Engine(registry)
    this.grid = new Map()
    this.position = {
      x: 0n,
      y: 0n
    }
    this.direction = buildDirection()
    this.defaultColor = defaultColor
  }

  process() {
    while (1) {
      const nextOpcode = this.colorToOpcode(this.readGridColor())

      const { halted: h1 } = this.engine.processUntilOutput(nextOpcode)
      if (h1) break

      if (this.engine.getLastOutput() === 0n) {
        this.paintOnGrid(Color.Black)
      }

      if (this.engine.getLastOutput() === 1n) {
        this.paintOnGrid(Color.White)
      }

      const { halted: h2 } = this.engine.processUntilOutput()
      if (h2) break

      if (this.engine.getLastOutput() === 0n) {
        this.direction.rotateLeft()
      }

      if (this.engine.getLastOutput() === 1n) {
        this.direction.rotateRight()
      }

      this.moveForward()
    }
  }

  moveForward() {
    const [dx, dy] = this.direction.current()

    this.position.x += BigInt(dx)
    this.position.y += BigInt(dy)
  }

  colorToOpcode(color: Color) {
    switch (color) {
      case Color.White:
        return 1n
      case Color.Black:
      default:
        return 0n
    }
  }

  readGridColor() {
    return (
      this.grid.get(`${this.position.x},${this.position.y}`) ||
      this.defaultColor
    )
  }

  paintOnGrid(color: Color) {
    this.grid.set(`${this.position.x},${this.position.y}`, color)
  }
}
