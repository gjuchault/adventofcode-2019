export const composeColors = (...colors: number[]) => {
  return colors.reduce((acc, color) => {
    if (color === 2) {
      return acc
    }

    return color
  }, 2)
}
