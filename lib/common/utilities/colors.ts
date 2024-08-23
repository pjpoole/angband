import { stricmp } from './string'

// NB. Always iterate colorTable just for consistency

// This function, contrasted with asEnum, returns a number, not a string
export function colorStringToAttribute(name: string): C {
  if (name === '' || name === ' ') return C.DARK

  if (name.length === 1) {
    // ids are case-sensitive
    for (let i = 0; i < colorTable.length; i++) {
      if (colorTable[i].id === name) return i
    }
  } else {
    // names are case-insensitive
    for (let i = 0; i < colorTable.length; i++) {
      if (stricmp(colorTable[i].name, name)) return i
    }
  }

  // default to white on miss
  return C.WHITE
}

export function isColorString(name: string): name is ColorName | ColorId {
  for (const row of colorTable) {
    if (row.id === name || row.name === name) return true
  }
  return false
}

// For serialization
export function colorCodeToString(colorCode: C): ColorId {
  return colorTable[colorCode].id
}

// For parsing
export function normalizeColorString(name: string): ColorName {
  const idx = colorStringToAttribute(name)
  return colorTable[idx].name
}

export enum C {
  DARK,
  WHITE,
  SLATE,
  ORANGE,
  RED,
  GREEN,
  BLUE,
  UMBER,
  L_DARK,
  L_WHITE,
  L_PURPLE,
  YELLOW,
  L_RED,
  L_GREEN,
  L_BLUE,
  L_UMBER,
  PURPLE,
  VIOLET,
  TEAL,
  MUD,
  L_YELLOW,
  MAGENTA,
  L_TEAL,
  L_VIOLET,
  L_PINK,
  MUSTARD,
  BLUE_SLATE,
  DEEP_L_BLUE,
  SHADE,
}

// "Official" colors
// corresponds 1-1 with the above
// Should probably be an object, but ... eh
export const angbandColorTable = [
  '#000000',
  '#ffffff',
  '#808080',
  '#ff8000',
  '#c00000',
  '#008040',
  '#0040ff',
  '#804000',
  '#606060',
  '#c0c0c0',
  '#ff00ff',
  '#ffff00',
  '#ff4040',
  '#00ff00',
  '#00ffff',
  '#c08040',
  '#900090',
  '#9020ff',
  '#00a0a0',
  '#6c6c30',
  '#ffff90',
  '#ff00a0',
  '#20ffdc',
  '#b8a8ff',
  '#ff8080',
  '#b4b400',
  '#a0c0d0',
  '#00b0ff',
  '#282828',
]

/*
 * Keeping table as-is from original game until it is found I don't need some
 * settings
 *
 * values fields are, in order,
 * full mono vga blind lighter darker highlight metallic misc
 *
 * full color translation
 * mono color translation
 * 16 color translation
 * "Blind" color translation <-- this, and the next four, are important game effects
 * "Torchlit" color translation
 * "Dark" color translation
 * "Highlight" color translation
 * "Metallic" color translation
 * "Miscellaneous" - see misc_to_attr
 */

type ColorTableRow = [C, C, C, C, C, C, C, C, C]

export interface ColorTableObject {
  id: ColorId
  name: ColorName
  values: ColorTableRow
}

export type ColorId = typeof ColorIds[number]
export type ColorName = typeof ColorNames[number]

const ColorIds = [
  'd', 'w', 's', 'o',
  'r', 'g', 'b', 'u',
  'D', 'W', 'P', 'y',
  'R', 'G', 'B', 'U',
  'p', 'v', 't', 'm',
  'Y', 'i', 'T', 'V',
  'I', 'M', 'z', 'Z'
] as const

const ColorNames = [
  'Dark', 'White', 'Slate', 'Orange',
  'Red', 'Green', 'Blue', 'Umber',
  'Light Dark', 'Light Slate', 'Light Purple', 'Yellow',
  'Light Red', 'Light Green', 'Light Blue', 'Light Umber',
  'Purple', 'Violet', 'Teal', 'Mud',
  'Light Yellow', 'Magenta-Pink', 'Light Teal', 'Light Violet',
  'Light Pink', 'Mustard', 'Blue Slate', 'Deep Light Blue'
] as const

const ColorValues: ColorTableRow[]  = [
  [C.DARK, C.DARK, C.DARK, C.DARK, C.L_DARK, C.DARK, C.L_DARK, C.L_DARK, C.DARK],
  [C.WHITE, C.WHITE, C.WHITE, C.WHITE, C.YELLOW, C.L_WHITE, C.L_BLUE, C.YELLOW, C.WHITE],
  [C.SLATE, C.WHITE, C.SLATE, C.SLATE, C.L_WHITE, C.L_DARK, C.L_WHITE, C.L_WHITE, C.SLATE],
  [C.ORANGE, C.WHITE, C.ORANGE, C.L_WHITE, C.YELLOW, C.SLATE, C.YELLOW, C.YELLOW, C.ORANGE],
  [C.RED, C.WHITE, C.RED, C.SLATE, C.L_RED, C.SLATE, C.L_RED, C.L_RED, C.RED],
  [C.GREEN, C.WHITE, C.GREEN, C.SLATE, C.L_GREEN, C.SLATE, C.L_GREEN, C.L_GREEN, C.GREEN],
  [C.BLUE, C.WHITE, C.BLUE, C.SLATE, C.L_BLUE, C.SLATE, C.L_BLUE, C.L_BLUE, C.BLUE],
  [C.UMBER, C.WHITE, C.UMBER, C.L_DARK, C.L_UMBER, C.L_DARK, C.L_UMBER, C.L_UMBER, C.UMBER],
  [C.L_DARK, C.WHITE, C.L_DARK, C.L_DARK, C.SLATE, C.L_DARK, C.SLATE, C.SLATE, C.L_DARK],
  [C.L_WHITE, C.WHITE, C.L_WHITE, C.L_WHITE, C.WHITE, C.SLATE, C.WHITE, C.WHITE, C.SLATE],
  [C.L_PURPLE, C.WHITE, C.L_PURPLE, C.SLATE, C.YELLOW, C.SLATE, C.YELLOW, C.YELLOW, C.L_PURPLE],
  [C.YELLOW, C.WHITE, C.YELLOW, C.L_WHITE, C.L_YELLOW, C.L_WHITE, C.WHITE, C.WHITE, C.YELLOW],
  [C.L_RED, C.WHITE, C.L_RED, C.L_WHITE, C.YELLOW, C.RED, C.YELLOW, C.YELLOW, C.L_RED],
  [C.L_GREEN, C.WHITE, C.L_GREEN, C.L_WHITE, C.YELLOW, C.GREEN, C.YELLOW, C.YELLOW, C.L_GREEN],
  [C.L_BLUE, C.WHITE, C.L_BLUE, C.L_WHITE, C.YELLOW, C.BLUE, C.YELLOW, C.YELLOW, C.L_BLUE],
  [C.L_UMBER, C.WHITE, C.L_UMBER, C.L_WHITE, C.YELLOW, C.UMBER, C.YELLOW, C.YELLOW, C.L_UMBER],
  [C.PURPLE, C.WHITE, C.L_PURPLE, C.SLATE, C.L_PURPLE, C.SLATE, C.L_PURPLE, C.L_PURPLE, C.L_PURPLE],
  [C.VIOLET, C.WHITE, C.L_PURPLE, C.SLATE, C.L_PURPLE, C.SLATE, C.L_PURPLE, C.L_PURPLE, C.L_PURPLE],
  [C.TEAL, C.WHITE, C.BLUE, C.SLATE, C.L_TEAL, C.SLATE, C.L_TEAL, C.L_TEAL, C.L_BLUE],
  [C.MUD, C.WHITE, C.GREEN, C.SLATE, C.MUSTARD, C.SLATE, C.MUSTARD, C.MUSTARD, C.UMBER],
  [C.L_YELLOW, C.WHITE, C.YELLOW, C.WHITE, C.WHITE, C.YELLOW, C.WHITE, C.WHITE, C.L_YELLOW],
  [C.MAGENTA, C.WHITE, C.L_RED, C.SLATE, C.L_PINK, C.RED, C.L_PINK, C.L_PINK, C.L_PURPLE],
  [C.L_TEAL, C.WHITE, C.L_BLUE, C.L_WHITE, C.YELLOW, C.TEAL, C.YELLOW, C.YELLOW, C.L_BLUE],
  [C.L_VIOLET, C.WHITE, C.L_PURPLE, C.L_WHITE, C.YELLOW, C.VIOLET, C.YELLOW, C.YELLOW, C.L_PURPLE],
  [C.L_PINK, C.WHITE, C.L_RED, C.L_WHITE, C.YELLOW, C.MAGENTA, C.YELLOW, C.YELLOW, C.L_PURPLE],
  [C.MUSTARD, C.WHITE, C.YELLOW, C.SLATE, C.YELLOW, C.SLATE, C.YELLOW, C.YELLOW, C.YELLOW],
  [C.BLUE_SLATE, C.WHITE, C.L_WHITE, C.SLATE, C.DEEP_L_BLUE, C.SLATE, C.DEEP_L_BLUE, C.DEEP_L_BLUE, C.L_WHITE],
  [C.DEEP_L_BLUE, C.WHITE, C.L_BLUE, C.L_WHITE, C.L_BLUE, C.BLUE_SLATE, C.L_BLUE, C.L_BLUE, C.L_BLUE],
]

// Build at runtime to improve typing elsewhere
const colorTable = ColorIds.map((id, idx) => {
  return {
    id,
    name: ColorNames[idx],
    values: ColorValues[idx],
  }
})
