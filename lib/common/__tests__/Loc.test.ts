import { describe, expect, test } from '@jest/globals'

import { loc } from '../core/loc'

describe('Loc', () => {
  describe('eq()', () => {
    test('identity', () => {
      const pt1 = loc(1, 4)

      expect(pt1.eq(pt1)).toBe(true)
    })

    test('equality', () => {
      const pt1 = loc(1, 4)
      const pt2 = loc(1, 4)

      expect(pt1.eq(pt2)).toBe(true)
    })

    test('inequality', () => {
      const pt1 = loc(1, 4)
      const pt2 = loc(1, 5)
      const pt3 = loc(2, 4)
      const pt4 = loc(2, 5)

      expect(pt1.eq(pt2)).toBe(false)
      expect(pt1.eq(pt3)).toBe(false)
      expect(pt1.eq(pt4)).toBe(false)
    })
  })

  describe('sum()', () => {
    test('values', () => {
      const pt1 = loc(1, 2)
      const pt2 = loc(10, 15)

      const expected = loc(pt1.x + pt2.x, pt1.y + pt2.y)
      const actual = pt1.sum(pt2)

      expect(actual.eq(expected)).toBe(true)
    })

    test('commutativity', () => {
      const pt1 = loc(1, 2)
      const pt2 = loc(10, 15)

      const expected = pt1.sum(pt2)
      const commutative = pt2.sum(pt1)

      expect(commutative.eq(expected)).toBe(true)
    })
  })

  describe('offset()', () => {
    test('positive', () => {
      const offset = 3
      const pt = loc(14, 32)

      const expected = loc(pt.x + offset, pt.y + offset)
      const actual = pt.offset(offset)

      expect(expected.eq(actual))
    })

    test('negative', () => {
      const offset = -12
      const pt = loc(14, 32)

      const expected = loc(pt.x + offset, pt.y + offset)
      const actual = pt.offset(offset)

      expect(expected.eq(actual))
    })
  })

  describe('boxCorners()', () => {
    test('rectangle box (odd)', () => {
      const center = loc(12, 15)
      const width = 7
      const deltaX = Math.trunc(width / 2)
      const height = 5
      const deltaY = Math.trunc(height / 2)
      const expected1 = loc(center.x - deltaX, center.y - deltaY)
      const expected2 = loc(center.x + deltaX, center.y + deltaY)

      const [actual1, actual2] = center.box(height, width).extents()

      expect(actual2.x - actual1.x + 1).toEqual(width)
      expect(actual2.y - actual1.y + 1).toEqual(height)

      expect(actual1.eq(expected1)).toBe(true)
      expect(actual2.eq(expected2)).toBe(true)
    })

    test('rectangle box (even)', () => {
      const center = loc(12, 15)
      const width = 10
      const deltaX = Math.trunc(width / 2)
      const height = 6
      const deltaY = Math.trunc(height / 2)
      const expected1 = loc(center.x - deltaX, center.y - deltaY)
      const expected2 = loc(center.x + deltaX - 1, center.y + deltaY - 1)

      const [actual1, actual2] = center.box(height, width).extents()

      expect(actual2.x - actual1.x + 1).toEqual(width)
      expect(actual2.y - actual1.y + 1).toEqual(height)

      expect(actual1.eq(expected1)).toBe(true)
      expect(actual2.eq(expected2)).toBe(true)
    })

    test('square box', () => {
      const center = loc(12, 15)
      const height = 5
      const deltaX = Math.trunc(height / 2)
      const deltaY = Math.trunc(height / 2)
      const expected1 = loc(center.x - deltaX, center.y - deltaY)
      const expected2 = loc(center.x + deltaX, center.y + deltaY)

      const [actual1, actual2] = center.box(height).extents()

      expect(actual2.x - actual1.x + 1).toEqual(height)
      expect(actual2.y - actual1.y + 1).toEqual(height)

      expect(actual1.eq(expected1)).toBe(true)
      expect(actual2.eq(expected2)).toBe(true)
    })
  })

  describe('boxToRadius()', () => {
    test('square box', () => {
      const center = loc(12, 15)
      const radius = 5
      const height = radius * 2 + 1
      const expected1 = loc(center.x - radius, center.y - radius)
      const expected2 = loc(center.x + radius, center.y + radius)

      const [actual1, actual2] = center.boxR(radius).extents()

      expect(actual2.x - actual1.x + 1).toEqual(height)
      expect(actual2.y - actual1.y + 1).toEqual(height)

      expect(actual1.eq(expected1)).toBe(true)
      expect(actual2.eq(expected2)).toBe(true)
    })
  })

  describe('ported behavior', () => {
    describe('circular room', () => {
      test('bordering walls', () => {
        const center = loc(12, 15)
        const radius = 5

        const original1 = loc(center.x - radius - 2, center.y - radius - 2)
        const original2 = loc(center.x + radius + 2, center.y + radius + 2)

        const [actual1, actual2] = center.boxR(radius + 2).extents()

        expect(original1.eq(actual1)).toBe(true)
        expect(original2.eq(actual2)).toBe(true)
      })

      test('interior room', () => {
        const center = loc(12, 15)
        const offset = 2

        const original1 = loc(center.x - offset, center.y - offset)
        const original2 = loc(center.x + offset, center.y + offset)

        const [actual1, actual2] = center.boxR(offset).extents()

        expect(original1.eq(actual1)).toBe(true)
        expect(original2.eq(actual2)).toBe(true)
      })
    })

    test('large room', () => {
      const center = loc(50, 6)
      const height = 9
      const width = 23
      const dH = Math.trunc(height / 2)
      const dW = Math.trunc(width / 2)
      const exUpperLeft = loc(center.x - dW, center.y - dH)
      const exLowerRight = loc(center.x + dW, center.y + dH)

      const [acUpperLeft, acLowerRight] = center.box(height, width).extents()

      expect(acUpperLeft.eq(exUpperLeft)).toBe(true)
      expect(acLowerRight.eq(exLowerRight)).toBe(true)
    })
  })
})
