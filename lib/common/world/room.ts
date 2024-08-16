// list-rooms.h
const ROOM = [
  { name: 'staircase room', rows: 0, cols: 0, fn: buildStaircase },
  { name: 'simple room', rows: 0, cols: 0, fn: buildSimple },
  { name: 'moria room', rows: 0, cols: 0, fn: buildMoria },
  { name: 'large room', rows: 0, cols: 0, fn: buildLarge },
  { name: 'crossed room', rows: 0, cols: 0, fn: buildCrossed },
  { name: 'circular room', rows: 0, cols: 0, fn: buildCircular },
  { name: 'overlap room', rows: 0, cols: 0, fn: buildOverlap },
  { name: 'room template', rows: 11, cols: 33, fn: buildTemplate },
  { name: 'Interesting room', rows: 40, cols: 50, fn: buildInteresting },
  { name: 'monster pit', rows: 0, cols: 0, fn: buildPit },
  { name: 'monster nest', rows: 0, cols: 0, fn: buildNest },
  { name: 'huge room', rows: 0, cols: 0, fn: buildHuge },
  { name: 'room of chambers', rows: 0, cols: 0, fn: buildRoomOfChambers },
  { name: 'Lesser vault', rows: 22, cols: 22, fn: buildLesserVault },
  { name: 'Medium vault', rows: 22, cols: 33, fn: buildMediumVault },
  { name: 'Greater vault', rows: 44, cols: 66, fn: buildGreaterVault },
  { name: 'Lesser vault (new)', rows: 22, cols: 22, fn: buildLesserNewVault },
  { name: 'Medium vault (new)', rows: 22, cols: 33, fn: buildMediumNewVault },
  { name: 'Greater vault (new)', rows: 44, cols: 66, fn: buildGreaterNewVault },
]

export function isValidRoomName(name: string): boolean {
  for (const room of ROOM) {
    if (room.name === name) return true
  }

  return false
}

function buildStaircase() {}
function buildSimple() {}
function buildMoria() {}
function buildLarge() {}
function buildCrossed() {}
function buildCircular() {}
function buildOverlap() {}
function buildTemplate() {}
function buildInteresting() {}
function buildPit() {}
function buildNest() {}
function buildHuge() {}
function buildRoomOfChambers() {}
function buildLesserVault() {}
function buildMediumVault() {}
function buildGreaterVault() {}
function buildLesserNewVault() {}
function buildMediumNewVault() {}
function buildGreaterNewVault() {}
