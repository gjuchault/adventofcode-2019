export const adjust = (
  expectedResult: number,
  fn: (param: number) => number,
  initialEstimation: {
    param: number
    result: number
  }
) => {
  const largeEstimation = adjustLarge(expectedResult, fn, initialEstimation)

  const result = adjustPrecise(expectedResult, fn, largeEstimation)

  return result
}

export const adjustLarge = (
  expectedResult: number,
  fn: (param: number) => number,
  initialEstimation: {
    param: number
    result: number
  }
) => {
  let estimation = initialEstimation
  let lastEstimation = estimation

  while (1) {
    lastEstimation = estimation

    const ratio = estimation.result / expectedResult

    const newParam = Math.ceil((estimation.param * 1) / ratio)

    console.log(
      '{adjust large} current progress',
      `${(ratio * 100).toFixed(4)}%`
    )

    console.log(' --> baking ', newParam)
    estimation = {
      param: newParam,
      result: fn(newParam)
    }

    if (lastEstimation.param === estimation.param) {
      break
    }
  }

  return lastEstimation
}

export const adjustPrecise = (
  expectedResult: number,
  fn: (param: number) => number,
  initialEstimation: {
    param: number
    result: number
  }
) => {
  let estimation = initialEstimation
  let lastEstimation = estimation

  while (1) {
    lastEstimation = estimation

    const diff = estimation.result - expectedResult

    console.log(
      '{adjust precise} current progress',
      expectedResult,
      estimation.result,
      diff
    )
    if (diff > 0) {
      const newParam = estimation.param - 2

      estimation = {
        param: newParam,
        result: fn(newParam)
      }
    } else {
      const newParam = estimation.param + 1

      estimation = {
        param: newParam,
        result: fn(newParam)
      }

      if (estimation.result > expectedResult) {
        return {
          param: newParam - 1,
          result: fn(newParam - 1)
        }
      }
    }

    if (lastEstimation.param === estimation.param) {
      break
    }
  }

  return lastEstimation
}
