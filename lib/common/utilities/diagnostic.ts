type WrappedFunction = (...args: any) => any

export function timed(fn: WrappedFunction, template: string) {
  const startTime = Date.now()
  const result = fn()

  console.log(template, Date.now() - startTime)

  return result
}

let _times = 100

export function limitLogging(fn: WrappedFunction) {
  if (_times === 0) return
  _times--
  return fn()
}
