import { writeFileSync } from 'fs'

export enum CameraOutput {
  Scaffold = 35,
  None = 46,
  NewLine = 10,
  RobotFacingTop = 94,
  RobotFacingRight = 62,
  RobotFacingDown = 118,
  RobotFacingLeft = 60,
  RobotFalling = 88
}

export class Scaffold {
  grid: Map<string, CameraOutput> = new Map()

  feed(feed: bigint[]) {
    let x = 0
    let y = 0

    for (const item of feed.map(Number)) {
      this.grid.set(`${x},${y}`, item)

      if (item === CameraOutput.NewLine) {
        x = 0
        y += 1
      } else {
        x += 1
      }
    }
  }

  findIntersections() {
    let initialPos = [0, 0]
    let initialDirection = [0, 0]

    for (const [position, output] of this.grid) {
      if (isRobot(output)) {
        initialPos = position.split(',').map(Number)

        if (output === CameraOutput.RobotFacingTop) initialDirection = [0, -1]
        if (output === CameraOutput.RobotFacingRight) initialDirection = [1, 0]
        if (output === CameraOutput.RobotFacingDown) initialDirection = [0, 1]
        if (output === CameraOutput.RobotFacingLeft) initialDirection = [-1, 0]

        break
      }
    }

    const breadcrumb: string[] = []
    const intersections = new Set<string>()
    let position = initialPos
    let direction = initialDirection

    while (1) {
      const posStr = `${position[0]},${position[1]}`

      if (breadcrumb.includes(posStr)) {
        intersections.add(posStr)
      }

      breadcrumb.push(posStr)

      let nextPosition = [
        position[0] + direction[0],
        position[1] + direction[1]
      ]

      let nextDirection = direction

      // console.log('trying', nextPosition, this.isScaffold(nextPosition[0], nextPosition[1]))

      if (!this.isScaffold(nextPosition[0], nextPosition[1])) {
        // if robot is in vertical direction
        if (direction[0] === 0) {
          if (this.isScaffold(position[0] + 1, position[1])) {
            // either go right
            nextPosition = [position[0] + 1, position[1]]

            nextDirection = [1, 0]
          } else if (this.isScaffold(position[0] - 1, position[1])) {
            // or left
            nextPosition = [position[0] - 1, position[1]]

            nextDirection = [-1, 0]
          } else {
            // no movement possible anymore -> done
            break
          }
        } else {
          if (this.isScaffold(position[0], position[1] + 1)) {
            // either go down
            nextPosition = [position[0], position[1] + 1]

            nextDirection = [0, 1]
          } else if (this.isScaffold(position[0], position[1] - 1)) {
            // or top
            nextPosition = [position[0], position[1] - 1]

            nextDirection = [0, -1]
          } else {
            // no movement possible anymore -> done
            break
          }
        }
      }

      position = nextPosition
      direction = nextDirection
    }

    return Array.from(intersections).map(pos => pos.split(',').map(Number))
  }

  isScaffold(x: number, y: number) {
    return this.grid.get(`${x},${y}`) === CameraOutput.Scaffold
  }

  saveToFile() {
    const allPos = Array.from(this.grid.keys()).map(pos => pos.split(','))

    const allX = allPos.map(([x, y]) => Number(x))
    const allY = allPos.map(([x, y]) => Number(y))

    const minX = Math.min(...allX)
    const maxX = Math.max(...allX)
    const minY = Math.min(...allY)
    const maxY = Math.max(...allY)

    const screen: CameraOutput[][] = []

    for (let y = minY; y <= maxY; y += 1) {
      const column = []
      for (let x = minX; x <= maxX; x += 1) {
        column.push(this.grid.get(`${x},${y}`) || CameraOutput.None)
      }

      screen.push(column)
    }

    const screenStr = screen
      .map(row => row.map(code => String.fromCharCode(code)).join(''))
      .join('')

    writeFileSync('map.out', screenStr)
  }
}

export const isRobot = (output: CameraOutput) =>
  output === CameraOutput.RobotFacingTop ||
  output === CameraOutput.RobotFacingRight ||
  output === CameraOutput.RobotFacingDown ||
  output === CameraOutput.RobotFacingLeft ||
  output === CameraOutput.RobotFalling
