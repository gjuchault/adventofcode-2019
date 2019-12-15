export type Direction = {
  current: () => number[]
  rotateRight: () => void
  rotateLeft: () => void
}

export const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
]

export const buildDirection = () => {
  let direction = 0

  return {
    current: () => directions[direction],
    rotateRight: () => {
      direction = (direction + 1) % 4
    },
    rotateLeft: () => {
      direction = direction === 0 ? 3 : direction - 1
    }
  }
}
