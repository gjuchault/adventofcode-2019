export enum Tile {
  Empty = 0,
  Wall = 1,
  Block = 2,
  Paddle = 3,
  Ball = 4
}

export class ArcaneCabinet {
  grid: Map<string, Tile> = new Map()
  score: bigint = 0n
  paddleX: bigint = 0n
  ballX: bigint = 0n

  setTile(x: bigint, y: bigint, rawTile: bigint) {
    if (x === -1n && y === 0n) {
      this.score = rawTile
      return
    }

    const tile = this.rawTileToTile(rawTile)

    if (tile === Tile.Paddle) this.paddleX = x
    if (tile === Tile.Ball) this.ballX = x

    this.grid.set(`${x},${y}`, tile)
  }

  getScreen() {
    const allPos = Array.from(this.grid.keys()).map(pos => pos.split(','))

    const allX = allPos.map(([x, y]) => Number(x))
    const allY = allPos.map(([x, y]) => Number(y))

    const minX = Math.min(...allX)
    const maxX = Math.max(...allX)
    const minY = Math.min(...allY)
    const maxY = Math.max(...allY)

    const screen: Tile[][] = []

    for (let y = minY; y <= maxY; y += 1) {
      const column = []
      for (let x = minX; x <= maxX; x += 1) {
        column.push(this.grid.get(`${x},${y}`) || Tile.Empty)
      }

      screen.push(column)
    }

    return screen
  }

  render() {
    const screen = this.getScreen()

    const screenStr = screen
      .map(row => row.map(tile => this.tileToChar(tile)).join(''))
      .join('\n')

    this.consoleClear()

    console.log(screenStr)
  }

  consoleClear() {
    // @ts-ignore
    process.stdout.write('\u001bc')
  }

  tileToChar(tile: Tile) {
    switch (tile) {
      case Tile.Wall:
        return '█'
      case Tile.Block:
        return '#'
      case Tile.Paddle:
        return '='
      case Tile.Ball:
        return '•'
      case Tile.Empty:
      default:
        return ' '
    }
  }

  rawTileToTile(rawTile: bigint) {
    switch (rawTile) {
      case 1n:
        return Tile.Wall
      case 2n:
        return Tile.Block
      case 3n:
        return Tile.Paddle
      case 4n:
        return Tile.Ball
      case 0n:
      default:
        return Tile.Empty
    }
  }
}
