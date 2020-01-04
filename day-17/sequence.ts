export type Functions = {
  A: string
  B: string
  C: string
}

const newLine = '\n'.charCodeAt(0)
const yes = 'y'.charCodeAt(0)
const no = 'n'.charCodeAt(0)

export const findThreeSequences = (sequence: string) => {
  // FIXME: find algorithm for that
  const functions = {
    A: 'R6L10R8R8',
    B: 'R12L8L10',
    C: 'R12L10R6L10'
  }

  const mainRoutine = getMainRountine(functions, sequence)

  return {
    functions,
    mainRoutine
  }
}

const getMainRountine = (functions: Functions, sequence: string) => {
  let cursor = sequence
  const mainRoutine = []

  while (cursor.length) {
    if (cursor.startsWith(functions.A)) {
      mainRoutine.push('A')
      cursor = cursor.slice(functions.A.length)
    }

    if (cursor.startsWith(functions.B)) {
      mainRoutine.push('B')
      cursor = cursor.slice(functions.B.length)
    }

    if (cursor.startsWith(functions.C)) {
      mainRoutine.push('C')
      cursor = cursor.slice(functions.C.length)
    }
  }

  return mainRoutine.join(',')
}

export const buildInput = (functions: Functions, mainRoutine: string) => {
  const continuousVideoFeed = false

  return [
    ...mainRoutine.split('').map(char => char.charCodeAt(0)),
    newLine,
    ...functionToArray(functions.A),
    newLine,
    ...functionToArray(functions.B),
    newLine,
    ...functionToArray(functions.C),
    newLine,
    continuousVideoFeed ? yes : no,
    newLine
  ]
}

const functionToArray = (func: string) => {
  return func
    .split(/([RL])/)
    .slice(1)
    .join(',')
    .split('')
    .map(e => e.charCodeAt(0))
}
