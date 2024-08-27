export const isBrowser = Object.getPrototypeOf(
  Object.getPrototypeOf(globalThis)
) !== Object.prototype
