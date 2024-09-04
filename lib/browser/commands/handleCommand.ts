import { loc } from '../../common/core/loc'
import { DIR, moveDir } from '../../common/utilities/directions'

import { render } from '../drawing/render'
import { getMap, getPlayer } from '../game/gameData'

import { COMMANDS, getCommand } from './commands'

export function handleCommand(ev: KeyboardEvent) {
  const command = getCommand(ev.key, ev.ctrlKey, ev.altKey, ev.metaKey)

  if (command == null) return

  ev.preventDefault()
  ev.stopPropagation()

  const player = getPlayer()
  if (!player.isOnMap()) return

  // Hack; TODO: need val check
  const pt = player.pt ?? loc(-1, -1)

  switch (command) {
    case COMMANDS.MOVE_EAST: {
      player.move(moveDir(pt, DIR.EAST))
      break
    }
    case COMMANDS.MOVE_NORTHEAST: {
      player.move(moveDir(pt, DIR.NORTHEAST))
      break
    }
    case COMMANDS.MOVE_NORTH: {
      player.move(moveDir(pt, DIR.NORTH))
      break
    }
    case COMMANDS.MOVE_NORTHWEST: {
      player.move(moveDir(pt, DIR.NORTHWEST))
      break
    }
    case COMMANDS.MOVE_WEST: {
      player.move(moveDir(pt, DIR.WEST))
      break
    }
    case COMMANDS.MOVE_SOUTHWEST: {
      player.move(moveDir(pt, DIR.SOUTHWEST))
      break
    }
    case COMMANDS.MOVE_SOUTH: {
      player.move(moveDir(pt, DIR.SOUTH))
      break
    }
    case COMMANDS.MOVE_SOUTHEAST: {
      player.move(moveDir(pt, DIR.SOUTHEAST))
      break
    }
  }

  render(getMap())
}
