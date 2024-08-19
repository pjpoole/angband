import { describe, expect, test } from '@jest/globals'
import { Dice, DiceParams } from '../utilities/dice'

function makeParams(obj: Partial<DiceParams>): DiceParams {
  return {
    expressions: obj.expressions ?? [],
    b: obj.b ?? null,
    x: obj.x ?? null,
    y: obj.y ?? null,
    m: obj.m ?? null
  }
}

describe('Dice', () => {
  describe('new()', () => {
    test('basic parameters', () => {
      const params = makeParams({ b: 1 })

      const dice = new Dice(params)

      expect(dice.b).toEqual(1)
    })
  })
})
