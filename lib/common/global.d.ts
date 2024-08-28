type Assert =
  ((condition: any, message?: string) => asserts condition) |
  ((value: any, message?: string | Error) => void)

declare const assert: Assert
