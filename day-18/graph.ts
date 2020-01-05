export type Tile =
  | { kind: 'empty' }
  | { kind: 'wall' }
  | { kind: 'self' }
  | { kind: 'key'; key: string }
  | { kind: 'door'; door: string }

export type RawMap = Map<number, Map<number, Tile>>
export type Position = { x: number; y: number }

export const buildGraph = (input: string[]) => {
  const size = input.length

  const map: RawMap = new Map(
    Array(size)
      .fill(0)
      .map((_, y) => [
        y,
        new Map(
          Array(size)
            .fill(0)
            .map((_, x) => [x, { kind: 'empty' }])
        )
      ])
  )

  let selfPos: Position | undefined = undefined

  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[y].length; x += 1) {
      if (input[y][x] === '@') {
        map.get(y)!.set(x, { kind: 'self' })
        selfPos = { x, y }
      }
      if (input[y][x] === '.') map.get(y)!.set(x, { kind: 'empty' })
      if (input[y][x] === '#') map.get(y)!.set(x, { kind: 'wall' })
      if (isKey(input[y][x]))
        map.get(y)!.set(x, { kind: 'key', key: input[y][x] })
      if (isDoor(input[y][x]))
        map.get(y)!.set(x, { kind: 'door', door: input[y][x] })
    }
  }

  if (!selfPos) throw new Error("Couldn't find the initial position")

  return breadthFirstSearch(map, selfPos, [])
}

const isKey = (tile: string) =>
  tile !== '.' && tile !== '#' && tile !== '@' && tile.match(/[a-z]/)
const isDoor = (tile: string) =>
  tile !== '.' && tile !== '#' && tile !== '@' && tile.match(/[A-Z]/)

type Node = {
  tile: Tile
  x: number
  y: number
  parent?: Node
}

const breadthFirstSearch = (
  rawMap: RawMap,
  selfPos: Position,
  keys: string[]
) => {
  const queue: Node[] = []

  queue.push({
    ...selfPos,
    tile: {
      kind: 'self'
    }
  })

  const graph: string[] = [`${selfPos.x},${selfPos.y}`]

  while (queue.length) {
    const currentItem = queue.pop()!
    const { x, y } = currentItem

    const n = {
      x,
      y: y - 1,
      tile: rawMap.get(currentItem.y - 1)!.get(currentItem.x)!
    }
    const s = {
      x,
      y: y + 1,
      tile: rawMap.get(currentItem.y + 1)!.get(currentItem.x)!
    }
    const w = {
      x: x - 1,
      y,
      tile: rawMap.get(currentItem.y)!.get(currentItem.x - 1)!
    }
    const e = {
      x: x + 1,
      y,
      tile: rawMap.get(currentItem.y)!.get(currentItem.x + 1)!
    }

    for (const neighbor of [n, s, w, e]) {
      if (neighbor.tile.kind === 'wall') {
        continue
      }

      if (
        neighbor.tile.kind === 'door' &&
        !keys.includes(neighbor.tile.door.toLowerCase())
      ) {
        continue
      }

      if (graph.includes(`${neighbor.x},${neighbor.y}`)) continue

      if (neighbor.tile.kind === 'key') {
        console.log(
          `found key ${neighbor.tile.key} at ${neighbor.x}:${neighbor.y}`
        )
      }

      queue.push({
        x: neighbor.x,
        y: neighbor.y,
        tile: neighbor.tile
      })

      graph.push(`${x},${y}`)
    }
  }
}
