export function stricmp(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase()
}

export function kebabToPascal(str: string): string {
  return str.replace(/-[a-z]/g, (substr) => substr.replace('-', '').toUpperCase())
}
