export const NUM_COLS = 80
export const NUM_ROWS = 40

export function drawCells() {
  const gameNode = document.getElementById('game')
  if (gameNode == null) throw new Error('missing game root element')

  let currentCell = document.createElement('div')
  for (let y = 0; y < NUM_ROWS; y++) {
    currentCell.classList.add('row-start')
    for (let x = 0; x < NUM_COLS; x++) {
      currentCell.classList.add('cell', `row-${y}`, `col-${x}`)
      gameNode.append(currentCell)
      currentCell = document.createElement('div')
    }
  }
}
