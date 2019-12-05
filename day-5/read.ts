import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const readInput = (): Promise<number> =>
  new Promise((resolve, reject) => {
    rl.question('Opcode 3 encountered, input: ', answer => {
      const number = Number(answer)

      if (!Number.isSafeInteger(number)) {
        return reject(`Expected an integer but got ${answer} -> ${number}`)
      }

      resolve(number)
    })
  })
