export enum COMMANDS {
  MOVE_NORTH,
  MOVE_NORTHEAST,
  MOVE_EAST,
  MOVE_SOUTHEAST,
  MOVE_SOUTH,
  MOVE_SOUTHWEST,
  MOVE_WEST,
  MOVE_NORTHWEST
}

export const CommandMap: Record<string, COMMANDS> = {
  y: COMMANDS.MOVE_NORTHWEST,
  u: COMMANDS.MOVE_NORTHEAST,
  h: COMMANDS.MOVE_WEST,
  j: COMMANDS.MOVE_SOUTH,
  k: COMMANDS.MOVE_NORTH,
  l: COMMANDS.MOVE_EAST,
  b: COMMANDS.MOVE_SOUTHWEST,
  n: COMMANDS.MOVE_SOUTHEAST
}

export function getCommand(key: string, ctrl: boolean, alt: boolean, meta: boolean): COMMANDS | undefined {
  if (ctrl || alt || meta) return
  return CommandMap[key]
}
