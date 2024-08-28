import { Coord } from '../../core/coordinate'
import { oneIn, randInt0, randInt1 } from '../../core/rand'
import { clamp } from '../../utilities/number'
import { findSpace } from './helpers'

import { Cave } from '../cave'
import { Dungeon } from '../dungeon'
import { RoomTemplate, RoomTemplateRegistry } from '../roomTemplate'

enum SYMTR {
  FLAG_NONE = 0,
  FLAG_NO_ROT,
  FLAG_NO_REF,
  FLAG_FORCE_REF = 4,
  MAX_WEIGHT = 32768,
}

export function build(
  dungeon: Dungeon,
  chunk: Cave,
  center: Coord,
  rating: number,
): boolean {
  return buildRoomTemplateType(dungeon, chunk, center, 1, rating)
}

function buildRoomTemplateType(
  dungeon: Dungeon,
  chunk: Cave,
  center: Coord,
  type: number,
  rating: number,
): boolean {
  const template = getRandomRoomTemplate(type, rating)
  if (template == null) return false

  return buildRoomTemplate(dungeon, chunk, center, template)
}

function buildRoomTemplate(dungeon: Dungeon, chunk: Cave, center: Coord, template: RoomTemplate): boolean {
  const { height, width, doors } = template

  const light = chunk.depth <= randInt1(25)
  // Which random doors will we generate
  const randomDoor = randInt1(doors)
  // Do we generate optional walls
  const randomWalls = oneIn(2)

  let symmetryOp, tHeight, tWidth
  if (!chunk.isInbounds(center)) {
    symmetryOp = getRandomSymmetryTransform(
      height,
      width,
      SYMTR.FLAG_NONE,
    )

    tHeight = symmetryOp.height
    tWidth = symmetryOp.width

    if (!dungeon.findSpace(center, tHeight + 2, tWidth + 2)) return false
  } else {
    symmetryOp = getRandomSymmetryTransform(
      height,
      width,
      SYMTR.FLAG_NONE,
      0,
    )

    tHeight = symmetryOp.height
    tWidth = symmetryOp.width

    // no rotate
    assert(tHeight === height && tWidth === width)
  }

  center.x -= Math.trunc(tHeight / 2)
  center.y -= Math.trunc(tWidth / 2)

  // for (const )


  return true
}

type NumberMod4 = 0 | 1 | 2 | 3

interface SymmetryTransform {
  rotate: NumberMod4
  reflect: boolean
  height: number
  width: number
}

function getRandomSymmetryTransform(
  height: number,
  width: number,
  flags: number,
  weight?: number
): SymmetryTransform {
  // 0 means 90 or 270 degree rotations are forbidden
  weight ??= calculateDefaultTransposeWeight(height, width)
  const op = chooseSymmetryOperation(flags, weight)

  const rotate = (op % 4) as NumberMod4
  const reflect = op >= 4

  const doRotate = (rotate % 2) !== 0

  const tHeight = doRotate ? width : height
  const tWidth = doRotate ? height : width

  return { rotate, reflect, height: tHeight, width: tWidth }
}

function chooseSymmetryOperation(flags: number, weight: number): number {
  const weights = buildWeights(flags, weight)
  const draw = randInt0(weights[weights.length - 1])
  return binarySearch(weights, draw)
}

/*
 * There are four rotations and four rotations with reflection that are possible
 * Based on permitted flags, we build an array of weights that will help us
 * determine what symmetry operation we will perform
 */
function buildWeights(flags: number, weight: number): number[] {
  const weights = new Array(9)
  const transposeWeight = clamp(0, SYMTR.MAX_WEIGHT, weight)

  const noReflect = (flags & SYMTR.FLAG_NO_REF) !== 0
  const forceReflect = (flags & SYMTR.FLAG_FORCE_REF) !== 0
  const noRotate = (flags & SYMTR.FLAG_NO_ROT) !== 0
  weights[0] = 0
  // if we're banning reflections or not forcing them, bang 1 right up to MAX
  // else, reflections are allowed
  weights[1] = noReflect || !forceReflect
    ? weights[0] + SYMTR.MAX_WEIGHT
    : weights[0]

  // if we're banning rotations, carry forward the choice from the previous
  // if we're banning reflections or not forcing them, add to the previous
  // else, carry forward 0s
  if (noRotate) {
    weights[2] = weights[1]
    weights[3] = weights[2]
    weights[4] = weights[3]
  } else if (noReflect || !forceReflect) {
    weights[2] = weights[1] + transposeWeight
    weights[3] = weights[2] + SYMTR.MAX_WEIGHT
    weights[4] = weights[3] + transposeWeight
  } else {
    weights[2] = weights[1]
    weights[3] = weights[2]
    weights[4] = weights[3]
  }

  // if reflections are not allowed, carry forward
  if (noReflect) {
    weights[5] = weights[4]
    weights[6] = weights[5]
    weights[7] = weights[6]
    weights[8] = weights[7]
  } else {
    weights[5] = weights[4] + SYMTR.MAX_WEIGHT
    if (noRotate) {
      weights[6] = weights[5]
      /*
       * 180 degree rotation with a horizontal reflection is
       * equivalent to a vertical reflection so don't exclude
       * in when forbidding rotations.
       */
      weights[7] = weights[6] + SYMTR.MAX_WEIGHT
      weights[8] = weights[7]
    } else {
      weights[6] = weights[5] + transposeWeight
      weights[7] = weights[6] + SYMTR.MAX_WEIGHT
      weights[8] = weights[7] + transposeWeight
    }
  }

  return weights
}

function binarySearch(ary: number[], value: number) {
  let low = 0
  let high = ary.length - 1
  while (true) {
    let mid
    if (low === high - 1) break
    mid = Math.trunc((low + high) / 2)
    if (ary[mid] <= value) {
      low = mid
    } else {
      high = mid
    }
  }

  return low
}

/*
 * lower values mean less probability of rotating
 *
 * our domain is clamped between 0 and 64, times the first term
 *   --> range is 0 to MAX_WEIGHT
 * when our object is symmetrical, the inner term comes out to be 128 - 64 = 64
 * when our object is tall, we're clamped down to 64
 * when our object is wide, we'll be less than 64
 *
 * since the map aspect ratio is wide, this increases the chance that tall
 * pieces will be flipped, but we won't attempt to flip wider pieces as often
 */
function calculateDefaultTransposeWeight(height: number, width: number) {
  return (
    Math.trunc(SYMTR.MAX_WEIGHT / 64) *
    clamp(0, 64, Math.trunc((128 * height) / width) - 64)
  )
}

// TODO: If we encounter this again, make abstract
function getRandomRoomTemplate(type: number, rating: number): RoomTemplate | undefined {
  let count = 0
  let found: RoomTemplate | undefined = undefined
  for (const template of RoomTemplateRegistry) {
    count++
    if (template.type === type && template.rating === rating) {
      if (oneIn(count)) found = template
      count++
    }
  }

  return found
}
