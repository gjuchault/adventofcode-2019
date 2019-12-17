type Position = { x: number; y: number; z: number }
type HistoryEntry = { pos: Position; vel: Position }
type Dimensions = { x?: boolean; y?: boolean; z?: boolean }

const threeD = { x: true, y: true, z: true }

export class Moon {
  position: Position
  velocity: Position
  initialPos: HistoryEntry

  constructor(x: number, y: number, z: number) {
    this.position = { x, y, z }
    this.velocity = { x: 0, y: 0, z: 0 }

    this.initialPos = {
      pos: { ...this.position },
      vel: { ...this.velocity }
    }
  }

  reset() {
    this.position = { ...this.initialPos.pos }
    this.velocity = { ...this.initialPos.vel }
  }

  applyVelocityFromMoon(moon: Moon, dimensions: Dimensions = threeD) {
    if (dimensions.x) {
      const deltaVx = getDeltaVelocity(moon.position.x, this.position.x)
      this.velocity.x += deltaVx
    }

    if (dimensions.y) {
      const deltaVy = getDeltaVelocity(moon.position.y, this.position.y)
      this.velocity.y += deltaVy
    }

    if (dimensions.z) {
      const deltaVz = getDeltaVelocity(moon.position.z, this.position.z)
      this.velocity.z += deltaVz
    }
  }

  applyVelocityIntoPosition(dimensions: Dimensions = threeD) {
    if (dimensions.x) this.position.x += this.velocity.x
    if (dimensions.y) this.position.y += this.velocity.y
    if (dimensions.z) this.position.z += this.velocity.z
  }

  getPotentialEnergy() {
    const { x, y, z } = this.position

    return Math.abs(x) + Math.abs(y) + Math.abs(z)
  }

  getKineticEnergy() {
    const { x, y, z } = this.velocity

    return Math.abs(x) + Math.abs(y) + Math.abs(z)
  }

  getEnergy() {
    return this.getPotentialEnergy() * this.getKineticEnergy()
  }

  toString() {
    const { x, y, z } = this.position
    const { x: vx, y: vy, z: vz } = this.velocity

    return `pos=<x=${x}, y=${y}, z=${z}>, vel=<x=${vx}, y=${vy}, z=${vz}>`
  }

  isBackToInitialPos(dimensions: Dimensions = threeD) {
    const { x, y, z } = this.position
    const { x: vx, y: vy, z: vz } = this.velocity

    const { x: ox, y: oy, z: oz } = this.initialPos.pos

    let sameX = true
    let sameY = true
    let sameZ = true

    if (dimensions.x) sameX = x === ox && vx === 0
    if (dimensions.y) sameY = y === oy && vy === 0
    if (dimensions.z) sameZ = z === oz && vz === 0

    return sameX && sameY && sameZ
  }
}

const getDeltaVelocity = (left: number, right: number) => {
  if (left === right) return 0

  return left > right ? 1 : -1
}

export const parseMoon = (input: string) => {
  const pos = Object.fromEntries(
    input
      .slice(1, -1)
      .split(', ')
      .map(coord => coord.split('='))
      .map(([name, value]) => [name, parseFloat(value)])
  ) as Position

  return new Moon(pos.x, pos.y, pos.z)
}
