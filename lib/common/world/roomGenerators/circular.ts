import { Coord } from '../../core/coordinate'
import { randInt1 } from '../../core/rand'
import { Cave } from '../cave'
import { Dungeon } from '../dungeon'

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  pt: Coord,
  rating: number,
): boolean {
  const radius = 2 + randInt1(2) + randInt1(3)

  const light = chunk.depth <= randInt1(25)

  return false
}
