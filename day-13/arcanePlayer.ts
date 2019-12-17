import { ArcaneCabinet } from './arcaneCabinet'

export const findBestJoystick = (cabinet: ArcaneCabinet) => {
  if (cabinet.ballX > cabinet.paddleX) return 1n
  if (cabinet.ballX < cabinet.paddleX) return -1n
  return 0n
}
