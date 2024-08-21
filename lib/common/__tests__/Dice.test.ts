import { describe, expect, test } from '@jest/globals'
import * as fs from 'node:fs/promises'

import { Dice, DiceParams, stringToDice } from '../utilities/dice'

function makeParams(obj: Partial<DiceParams>): DiceParams {
  return {
    expressions: obj.expressions ?? [],
    b: obj.b ?? null,
    x: obj.x ?? null,
    y: obj.y ?? null,
    m: obj.m ?? null
  }
}

describe('stringToDice()', () => {
  test('base only', () => {
    const dice = stringToDice('4')

    expect(dice.b).toEqual(4)
    expect(dice.x).toBeNull()
    expect(dice.y).toBeNull()
    expect(dice.m).toBeNull()
  })

  test('d value', () => {
    const dice = stringToDice('3d6')

    expect(dice.b).toBeNull()
    expect(dice.x).toEqual(3)
    expect(dice.y).toEqual(6)
    expect(dice.m).toBeNull()
  })

  test('base and d', () => {
    const dice = stringToDice('4+3d6')

    expect(dice.b).toEqual(4)
    expect(dice.x).toEqual(3)
    expect(dice.y).toEqual(6)
    expect(dice.m).toBeNull()
  })
})

// TODO: CLEARLY invalid values
describe('Dice', () => {
  describe('new()', () => {
    test('basic parameters', () => {
      const params = makeParams({ b: 1 })

      const dice = new Dice(params)

      expect(dice.b).toEqual(1)
    })
  })

  describe('isEqual()', () => {
    test('basic parameters', () => {
      const b = 1, x = 2, y = 3, m = 4
      const params = makeParams({ b, x, y, m })

      const dice1 = new Dice(params)
      const dice2 = new Dice(params)

      expect(dice1.isEqual(dice2)).toBe(true)

      expect(dice1.b).toEqual(dice2.b)
      expect(dice1.x).toEqual(dice2.x)
      expect(dice1.y).toEqual(dice2.y)
      expect(dice1.m).toEqual(dice2.m)
    })

    test('basic inequality', () => {
      const b = 1, x = 2, y = 3, m = 4
      const params1 = makeParams({ b, x, y, m })
      const params2 = makeParams({ b, x, y, m: 5 })

      const dice1 = new Dice(params1)
      const dice2 = new Dice(params2)

      expect(dice1.isEqual(dice2)).toBe(false)
    })
  })

  describe('toString()', () => {
    let passes = 0
    function stringBeforeAndAfter(line: string) {
      const dice1 = stringToDice(line)
      const stringified = dice1.toString()

      const dice2 = stringToDice(stringified)

      expect(dice1.isEqual(dice2)).toBe(true)
      passes++
    }

    test('basic values', () => {
      stringBeforeAndAfter('10')
      stringBeforeAndAfter('3d6')
      stringBeforeAndAfter('12+8d7')
    })

    // grepped all 'dice:' lines from lib/gamedata in angband
    // TODO: verify parser works with leading-M values
    test('dice entries from file', async () => {
      const diceData = await fs.readFile('./lib/common/__tests__/fixtures/diceStrings.txt', { encoding: 'utf-8' })
      const lines = diceData.split('\n').filter(el => el !== '' && !el.startsWith('#'))

      for (const line of lines) {
        stringBeforeAndAfter(line)
      }
    })
  })
})
