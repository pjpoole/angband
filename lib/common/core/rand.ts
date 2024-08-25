// TODO: repeated seed; port z-rand
export function randInt0(number: number): number {
  return Math.floor(Math.random() * number)
}

export function oneIn(number: number): boolean {
  return randInt0(number) === 0
}
