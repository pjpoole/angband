export class Flags {
  private readonly flags: boolean[]

  constructor(size: number) {
    this.flags = new Array(size)
  }

  copy(flags: Flags) {
    for (let i = 0; i < flags.flags.length; i++) {
      this.flags[i] = flags.flags[i]
    }
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
