import { Loc } from '../../common/core/loc'
import { debug } from '../../common/utilities/diagnostic'

import { Cave } from '../../common/world/cave'
import { FEAT, Feature } from '../../common/world/features'
import { SQUARE } from '../../common/world/square'
import { Tile } from '../../common/world/tile'

import { renderBare, renderChange } from '../drawing/render'

const FRAMES_PER_SECOND = 60
const TARGET_MS_PER_FRAME = Math.floor(1000 / FRAMES_PER_SECOND)

interface DrawingOperation {
  op: 'setFeature'
  pt: Loc
  feat: Feature | FEAT
}

interface FlagOperation {
  op: 'turnOn' | 'turnOff'
  pt: Loc
  flag: SQUARE
}

type QueueOperation = DrawingOperation | FlagOperation

interface Operations {
  pt: Loc
  ops: QueueOperation[]
}

export function withLiveUpdate<T>(fn: (...args: any) => T): T {
  const oldSetFeature = Cave.prototype.setFeature
  const oldTurnOn = Tile.prototype.turnOn
  const oldTurnOff = Tile.prototype.turnOff

  let callCount = 0
  let previousThis: Cave

  Tile.prototype.turnOn = function turnOn(flag: SQUARE){
    oldTurnOn.call(this, flag)
    enqueueFrame({ op: 'turnOn', pt: this.pt, flag })
  }

  Tile.prototype.turnOff = function turnOff(flag: SQUARE){
    oldTurnOn.call(this, flag)
    enqueueFrame({ op: 'turnOff', pt: this.pt, flag })
  }

  Cave.prototype.setFeature = function setFeature(tile: Tile, _feature: Feature | FEAT) {
    oldSetFeature.call(this, tile, _feature)

    callCount++

    let thisObj
    if (previousThis !== this) {
      thisObj = this
      previousThis = this
    }

    const op: DrawingOperation = { op: 'setFeature', pt: tile.pt, feat: _feature }
    enqueueFrame(op, thisObj)
  }

  const startTime = Date.now()
  const result = fn()
  debug(`${callCount} calls to set feature in ${Date.now() - startTime} ms`)

  Cave.prototype.setFeature = oldSetFeature
  Tile.prototype.turnOn = oldTurnOn
  Tile.prototype.turnOff = oldTurnOff

  startAnimation()

  return result
}

const _caveQueue: [QueueOperation, Cave | undefined][] = []
let _queueDrawing = false
let _prevFrame: number
let _currentCave: Cave

function enqueueFrame(op: QueueOperation, cave?: Cave): void {
  _caveQueue.push([op, cave])
}

// Prevent infinite loops
function startAnimation() {
  if (!_queueDrawing) {
    debug('animation start')
    _queueDrawing = true
    drawFrame()
  }
}

function drawFrame() {
  let obj
  do {
    // ditch enqueue ops that happened before we knew what the current cave was
    obj = _caveQueue.shift()
    if (obj && obj[1]) {
      debug('new cave')
      _currentCave = Cave.from(obj[1])
      renderBare(_currentCave)
    }
  } while (_currentCave == null)

  if (obj == null) {
    debug('animation end')
    _queueDrawing = false
    return
  }

  const op = obj[0]
  const ops: Operations = {
    pt: op.pt,
    ops: [op]
  }

  let sameCoords = true
  while (sameCoords) {
    obj = _caveQueue[0]
    if (obj && obj[1] == null && obj[0].pt.eq(op.pt)) {
      ops.ops.push(_caveQueue.shift()![0])
    } else {
      sameCoords = false
    }
  }

  _prevFrame ??= Date.now()
  drawNextFrame(ops)
}

function drawNextFrame(ops: Operations) {
  const p = ops.pt
  let tile = _currentCave.get(p)
  for (const op of ops.ops) {
    if (op.op === 'setFeature') {
      _currentCave.setFeature(tile, op.feat)
    } else {
      if (op.op === 'turnOn') {
        _currentCave.turnOn(p, op.flag)
      } else {
        _currentCave.turnOff(p, op.flag)
      }
    }
  }
  _prevFrame = Date.now()
  if (renderChange(_currentCave, tile)) {
    setTimeout(drawFrame, getNextFrameTime(_prevFrame))
  } else {
    drawFrame()
  }
}

function getNextFrameTime(prevFrame: number): number {
  const elapsed = (Date.now() - prevFrame)
  const nextTime = TARGET_MS_PER_FRAME - elapsed
  if (nextTime < 0) console.log(`took ${elapsed} ms on previous frame`)
  return Math.max(nextTime, 10)
}
