import { describe, expect, test } from '@jest/globals'

import { cEq, cOffset, cSum, cToBox } from '../core/coordinate'

describe('Coord', () => {
  describe('cEq', () => {
    test('equality', () => {
      const pt1 = { x: 1, y: 4 }
      const pt2 = { x: 1, y: 4 }

      expect(cEq(pt1, pt1)).toBe(true)
      expect(cEq(pt1, pt2)).toBe(true)
    })

    test('inequality', () => {
      const pt1 = { x: 1, y: 4 }
      const pt2 = { x: 1, y: 5 }
      const pt3 = { x: 2, y: 4 }
      const pt4 = { x: 2, y: 5 }

      expect(cEq(pt1, pt2)).toBe(false)
      expect(cEq(pt1, pt3)).toBe(false)
      expect(cEq(pt1, pt4)).toBe(false)
    })
  })

  describe('cSum', () => {
    test('values', () => {
      const pt1 = { x: 1, y: 2 }
      const pt2 = { x: 10, y: 15 }

      const expected = { x: pt1.x + pt2.x, y: pt1.y + pt2.y }
      const actual = cSum(pt1, pt2)

      expect(cEq(actual, expected)).toBe(true)
    })

    test('commutativity', () => {
      const pt1 = { x: 1, y: 2 }
      const pt2 = { x: 10, y: 15 }

      const expected = cSum(pt1, pt2)
      const commutative = cSum(pt2, pt1)

      expect(cEq(commutative, expected)).toBe(true)
    })
  })

  describe('cOffset', () => {
    test('positive', () => {
      const offset = 3
      const pt = { x: 14, y: 32 }

      const expected = { x: pt.x + offset, y: pt.y + offset }
      const actual = cOffset(pt, offset)

      expect(cEq(expected, actual))
    })

    test('negative', () => {
      const offset = -12
      const pt = { x: 14, y: 32 }

      const expected = { x: pt.x + offset, y: pt.y + offset }
      const actual = cOffset(pt, offset)

      expect(cEq(expected, actual))
    })
  })

  describe('cToBox', () => {
    test('rectangle box (odd)', () => {
      const center = { x: 12, y: 15 }
      const width = 7
      const deltaX = Math.trunc(width / 2)
      const height = 5
      const deltaY = Math.trunc(height / 2)
      const expected1 = { x: center.x - deltaX, y: center.y - deltaY }
      const expected2 = { x: center.x + deltaX, y: center.y + deltaY }

      const [actual1, actual2] = cToBox(center, height, width)

      expect(actual2.x - actual1.x + 1).toEqual(width)
      expect(actual2.y - actual1.y + 1).toEqual(height)

      expect(cEq(actual1, expected1)).toBe(true)
      expect(cEq(actual2, expected2)).toBe(true)
    })

    test('rectangle box (even)', () => {
      const center = { x: 12, y: 15 }
      const width = 10
      const deltaX = Math.trunc(width / 2)
      const height = 6
      const deltaY = Math.trunc(height / 2)
      const expected1 = { x: center.x - deltaX, y: center.y - deltaY }
      const expected2 = { x: center.x + deltaX - 1, y: center.y + deltaY - 1 }

      const [actual1, actual2] = cToBox(center, height, width)

      expect(actual2.x - actual1.x + 1).toEqual(width)
      expect(actual2.y - actual1.y + 1).toEqual(height)

      expect(cEq(actual1, expected1)).toBe(true)
      expect(cEq(actual2, expected2)).toBe(true)
    })

    test('square box', () => {
      const center = { x: 12, y: 15 }
      const radius = 5
      const expected1 = { x: center.x - radius, y: center.y - radius }
      const expected2 = { x: center.x + radius, y: center.y + radius }

      const [actual1, actual2] = cToBox(center, radius)

      expect(cEq(actual1, expected1)).toBe(true)
      expect(cEq(actual2, expected2)).toBe(true)
    })
  })

  describe('ported behavior', () => {
    describe('circular room', () => {
      test('bordering walls', () => {
        const center = { x: 12, y: 15 }
        const radius = 5

        const original1 = { x: center.x - radius - 2, y: center.y - radius - 2 }
        const original2 = { x: center.x + radius + 2, y: center.y + radius + 2 }

        const [actual1, actual2] = cToBox(center, radius + 2)

        expect(cEq(original1, actual1)).toBe(true)
        expect(cEq(original2, actual2)).toBe(true)
      })

      test('interior room', () => {
        const center = { x: 12, y: 15 }
        const offset = 2

        const original1 = { x: center.x - offset, y: center.y - offset }
        const original2 = { x: center.x + offset, y: center.y + offset }

        const [actual1, actual2] = cToBox(center, offset)

        expect(cEq(original1, actual1)).toBe(true)
        expect(cEq(original2, actual2)).toBe(true)
      })
    })
  })
})
