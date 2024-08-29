export function stricmp(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase()
}

export function stristr(str: string, pattern: string): string | null {
  const istr = str.toLowerCase(), ipat = pattern.toLowerCase()
  const idx = istr.indexOf(ipat)
  return idx === -1 ? null : str.substring(idx, idx + pattern.length)
}

export function isISubstr(str: string, pattern: string): boolean {
  const istr = str.toLowerCase(), ipat = pattern.toLowerCase()
  return istr.indexOf(ipat) !== -1
}

export function kebabToPascal(str: string): string {
  return str.replace(/-[a-z]/g, (substr) => substr.replace('-', '').toUpperCase())
}

export function getPrefixAndSuffix(str: string, separator: string = '_') {
  const cutPoint = str.indexOf(separator) + separator.length
  return [str.substring(0, cutPoint), str.substring(cutPoint)]
}

// ctype.h-compatible digit testing
const CODE_0 = '0'.charCodeAt(0)
const CODE_9 = '9'.charCodeAt(0)
const CODE_A = 'A'.charCodeAt(0)
const CODE_Z = 'Z'.charCodeAt(0)
const CODE_a = 'a'.charCodeAt(0)
const CODE_z = 'z'.charCodeAt(0)

// ctype.h-compatible space checker
export function isSpace(char: string | undefined) {
  return char && char.length === 1 && (
    char === ' ' ||
    char === '\n' ||
    char === '\t' ||
    char === '\r' ||
    char === '\v' ||
    char === '\f'
  )
}

export function isDigit(char: string | undefined): boolean {
  if (!(char && char.length === 1)) return false
  const code = char.charCodeAt(0)
  return (CODE_0 <= code && code <= CODE_9)
}

export function isUpper(char: string): boolean {
  if (!(char && char.length === 1)) return false
  const code = char.charCodeAt(0)
  return (CODE_A <= code && code <= CODE_Z)
}

export function isAlpha(char: string | undefined): boolean {
  if (!(char && char.length === 1)) return false
  const code = char.charCodeAt(0)
  return (
    (CODE_a <= code && code <= CODE_z) ||
    (CODE_A <= code && code <= CODE_Z)
  )
}
