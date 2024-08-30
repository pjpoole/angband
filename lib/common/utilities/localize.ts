export function pluralize(str: string): string {
  if ((/[^aeiou]y$/.test(str))) {
    return str.replace(/y$/, 'ies')
  } else {
    return `${str}s`
  }
}

export function pascalWords(str: string): string {
  return str.replace(/([a-z])([A-Z])/, '$1 $2')
}
