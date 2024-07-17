export function colorStringToAttribute(name: string): C {
  if (name === '' || name === ' ') return C.DARK

  const key = name.length === 1 ? 'id' : 'name'

  for (let i = 0; i < colorTable.length; i++) {
    if (colorTable[i][key] === name) return i
  }

  // default to white on miss
  return C.WHITE
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
export interface ColorTableObject {
  id: string // char
  name: string
  values: [C, C, C, C, C, C, C, C, C]
}

export const colorTable: ColorTableObject[] = [
  {id: 'd', name: 'Dark', values: [C.DARK, C.DARK, C.DARK, C.DARK, C.L_DARK, C.DARK, C.L_DARK, C.L_DARK, C.DARK] },
  {id: 'w', name: 'White', values: [C.WHITE, C.WHITE, C.WHITE, C.WHITE, C.YELLOW, C.L_WHITE, C.L_BLUE, C.YELLOW, C.WHITE] },
  {id: 's', name: 'Slate', values: [C.SLATE, C.WHITE, C.SLATE, C.SLATE, C.L_WHITE, C.L_DARK, C.L_WHITE, C.L_WHITE, C.SLATE] },
  {id: 'o', name: 'Orange', values: [C.ORANGE, C.WHITE, C.ORANGE, C.L_WHITE, C.YELLOW, C.SLATE, C.YELLOW, C.YELLOW, C.ORANGE] },
  {id: 'r', name: 'Red', values: [C.RED, C.WHITE, C.RED, C.SLATE, C.L_RED, C.SLATE, C.L_RED, C.L_RED, C.RED] },
  {id: 'g', name: 'Green', values: [C.GREEN, C.WHITE, C.GREEN, C.SLATE, C.L_GREEN, C.SLATE, C.L_GREEN, C.L_GREEN, C.GREEN] },
  {id: 'b', name: 'Blue', values: [C.BLUE, C.WHITE, C.BLUE, C.SLATE, C.L_BLUE, C.SLATE, C.L_BLUE, C.L_BLUE, C.BLUE] },
  {id: 'u', name: 'Umber', values: [C.UMBER, C.WHITE, C.UMBER, C.L_DARK, C.L_UMBER, C.L_DARK, C.L_UMBER, C.L_UMBER, C.UMBER] },
  {id: 'D', name: 'Light Dark', values: [C.L_DARK, C.WHITE, C.L_DARK, C.L_DARK, C.SLATE, C.L_DARK, C.SLATE, C.SLATE, C.L_DARK] },
  {id: 'W', name: 'Light Slate', values: [C.L_WHITE, C.WHITE, C.L_WHITE, C.L_WHITE, C.WHITE, C.SLATE, C.WHITE, C.WHITE, C.SLATE] },
  {id: 'P', name: 'Light Purple', values: [C.L_PURPLE, C.WHITE, C.L_PURPLE, C.SLATE, C.YELLOW, C.SLATE, C.YELLOW, C.YELLOW, C.L_PURPLE] },
  {id: 'y', name: 'Yellow', values: [C.YELLOW, C.WHITE, C.YELLOW, C.L_WHITE, C.L_YELLOW, C.L_WHITE, C.WHITE, C.WHITE, C.YELLOW] },
  {id: 'R', name: 'Light Red', values: [C.L_RED, C.WHITE, C.L_RED, C.L_WHITE, C.YELLOW, C.RED, C.YELLOW, C.YELLOW, C.L_RED] },
  {id: 'G', name: 'Light Green', values: [C.L_GREEN, C.WHITE, C.L_GREEN, C.L_WHITE, C.YELLOW, C.GREEN, C.YELLOW, C.YELLOW, C.L_GREEN] },
  {id: 'B', name: 'Light Blue', values: [C.L_BLUE, C.WHITE, C.L_BLUE, C.L_WHITE, C.YELLOW, C.BLUE, C.YELLOW, C.YELLOW, C.L_BLUE] },
  {id: 'U', name: 'Light Umber', values: [C.L_UMBER, C.WHITE, C.L_UMBER, C.L_WHITE, C.YELLOW, C.UMBER, C.YELLOW, C.YELLOW, C.L_UMBER] },
  {id: 'p', name: 'Purple', values: [C.PURPLE, C.WHITE, C.L_PURPLE, C.SLATE, C.L_PURPLE, C.SLATE, C.L_PURPLE, C.L_PURPLE, C.L_PURPLE] },
  {id: 'v', name: 'Violet', values: [C.VIOLET, C.WHITE, C.L_PURPLE, C.SLATE, C.L_PURPLE, C.SLATE, C.L_PURPLE, C.L_PURPLE, C.L_PURPLE] },
  {id: 't', name: 'Teal', values: [C.TEAL, C.WHITE, C.BLUE, C.SLATE, C.L_TEAL, C.SLATE, C.L_TEAL, C.L_TEAL, C.L_BLUE] },
  {id: 'm', name: 'Mud', values: [C.MUD, C.WHITE, C.GREEN, C.SLATE, C.MUSTARD, C.SLATE, C.MUSTARD, C.MUSTARD, C.UMBER] },
  {id: 'Y', name: 'Light Yellow', values: [C.L_YELLOW, C.WHITE, C.YELLOW, C.WHITE, C.WHITE, C.YELLOW, C.WHITE, C.WHITE, C.L_YELLOW] },
  {id: 'i', name: 'Magenta-Pink', values: [C.MAGENTA, C.WHITE, C.L_RED, C.SLATE, C.L_PINK, C.RED, C.L_PINK, C.L_PINK, C.L_PURPLE] },
  {id: 'T', name: 'Light Teal', values: [C.L_TEAL, C.WHITE, C.L_BLUE, C.L_WHITE, C.YELLOW, C.TEAL, C.YELLOW, C.YELLOW, C.L_BLUE] },
  {id: 'V', name: 'Light Violet', values: [C.L_VIOLET, C.WHITE, C.L_PURPLE, C.L_WHITE, C.YELLOW, C.VIOLET, C.YELLOW, C.YELLOW, C.L_PURPLE] },
  {id: 'I', name: 'Light Pink', values: [C.L_PINK, C.WHITE, C.L_RED, C.L_WHITE, C.YELLOW, C.MAGENTA, C.YELLOW, C.YELLOW, C.L_PURPLE] },
  {id: 'M', name: 'Mustard', values: [C.MUSTARD, C.WHITE, C.YELLOW, C.SLATE, C.YELLOW, C.SLATE, C.YELLOW, C.YELLOW, C.YELLOW] },
  {id: 'z', name: 'Blue Slate', values: [C.BLUE_SLATE, C.WHITE, C.L_WHITE, C.SLATE, C.DEEP_L_BLUE, C.SLATE, C.DEEP_L_BLUE, C.DEEP_L_BLUE, C.L_WHITE] },
  {id: 'Z', name: 'Deep Light Blue', values: [C.DEEP_L_BLUE, C.WHITE, C.L_BLUE, C.L_WHITE, C.L_BLUE, C.BLUE_SLATE, C.L_BLUE, C.L_BLUE, C.L_BLUE] },
]
