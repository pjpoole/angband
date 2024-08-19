export function stricmp(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase()
}

export function kebabToPascal(str: string): string {
  return str.replace(/-[a-z]/g, (substr) => substr.replace('-', '').toUpperCase())
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

export function isUpper(char: string) {
  return char.length === 1 && char === char.toUpperCase()
}
