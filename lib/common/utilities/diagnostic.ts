export function timed(fn: (...args: any) => any, template: string) {
  const startTime = Date.now()
  const result = fn()

  console.log(template, Date.now() - startTime)

  return result
}
