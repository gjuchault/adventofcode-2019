import { Engine } from './engine'

export enum Direction {
  North = 1,
  South = 2,
  West = 3,
  East = 4
}

export type Position = {
  x: number
  y: number
}

export enum TileType {
  Wall = 0,
  Empty = 1,
  OxygenSystem = 2
}

export type Tile = {
  type: TileType
  directionFromParent?: Direction
  parent?: Tile
}

export class Maze {
  registry: Map<bigint, bigint>
  queue: Position[]
  map: Map<string, Tile>

  constructor(registry: Map<bigint, bigint>) {
    this.registry = registry
    this.queue = []
    this.map = new Map()
  }

  findOxygen() {
    // Breadth-first search
    this.queue.push({ x: 0, y: 0 })
    this.map.set('0,0', {
      type: TileType.Empty
    })

    while (this.queue.length) {
      const pos = this.queue.pop()!
      const tile: Tile = this.map.get(posKey(pos))!

      // 1. navigate to pos
      const engine = new Engine(this.registry)
      const routeToTile = this.buildRouteToTile(tile)
      for (const path of routeToTile) {
        engine.processUntilOutput(BigInt(path))
      }

      // 2. break condition
      if (tile.type === TileType.OxygenSystem) {
        return routeToTile
      }

      // 3. generate adjacent positions
      const adjacents: Map<Direction, [Position, TileType]> = new Map([
        [
          Direction.North,
          [
            { x: pos.x, y: pos.y + 1 },
            this.getInfoAndGoBack(engine, Direction.North)
          ]
        ],
        [
          Direction.South,
          [
            { x: pos.x, y: pos.y - 1 },
            this.getInfoAndGoBack(engine, Direction.South)
          ]
        ],
        [
          Direction.West,
          [
            { x: pos.x - 1, y: pos.y },
            this.getInfoAndGoBack(engine, Direction.West)
          ]
        ],
        [
          Direction.East,
          [
            { x: pos.x + 1, y: pos.y },
            this.getInfoAndGoBack(engine, Direction.East)
          ]
        ]
      ])

      // 4. for each adjacent tile
      for (const [
        adjacentDirection,
        [adjacentPosition, adjacentTileType]
      ] of adjacents) {
        // if not already discovered
        if (!this.map.has(posKey(adjacentPosition))) {
          // if discoverable (walls are not)
          if (adjacentTileType !== TileType.Wall) {
            this.map.set(posKey(adjacentPosition), {
              type: adjacentTileType,
              parent: tile,
              directionFromParent: adjacentDirection
            })

            this.queue.push(adjacentPosition)
          }
        }
      }
    }
  }

  buildRouteToTile(tile: Tile): Direction[] {
    const startingPath: Direction[] = []

    let cursor = tile
    while (1) {
      if (cursor.directionFromParent)
        startingPath.unshift(cursor.directionFromParent)

      if (!cursor.parent) break

      cursor = cursor.parent
    }

    return startingPath
  }

  getInfoAndGoBack(engine: Engine, direction: Direction): TileType {
    engine.processUntilOutput(BigInt(direction))

    switch (engine.getLastOutput()) {
      case 0n:
        return TileType.Wall
      case 1n: {
        engine.processUntilOutput(BigInt(this.opposite(direction)))
        return TileType.Empty
      }
      case 2n: {
        engine.processUntilOutput(BigInt(this.opposite(direction)))
        return TileType.OxygenSystem
      }
      default:
        throw new Error(`Invalid tile type ${engine.getLastOutput()}`)
    }
  }

  opposite(direction: Direction) {
    switch (direction) {
      case Direction.North:
        return Direction.South
      case Direction.South:
        return Direction.North
      case Direction.West:
        return Direction.East
      case Direction.East:
        return Direction.West
    }
  }
}

const posKey = (pos: Position) => `${pos.x},${pos.y}`
