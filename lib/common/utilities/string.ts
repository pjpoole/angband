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

// ctype.h-compatible digit testing
const CODE_0 = '0'.charCodeAt(0)
const CODE_9 = '9'.charCodeAt(0)

export function isDigit(char: string) {
  const charCode = char.charCodeAt(0)
  return (
    char.length === 1 &&
    charCode >= CODE_0 &&
    charCode <= CODE_9
  )
}

const CODE_A = 'A'.charCodeAt(0)
const CODE_Z = 'Z'.charCodeAt(0)

export function isUpper(char: string) {
  return (
    char.length === 1 &&
    char.charCodeAt(0) >= CODE_A &&
    char.charCodeAt(0) <= CODE_Z
  )
}
