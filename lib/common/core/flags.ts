export class Flags {
  private readonly flags: boolean[]

  constructor(size: number) {
    this.flags = new Array(size)
  }

  has(flag: number): boolean {
    return this.flags[flag] === true
  }

  turnOn(flag: number) {
    this.flags[flag] = true
  }

  turnOff(flag: number) {
    this.flags[flag] = false
  }
}
