export const regexpPattern = {
  email: '^[^@]+@[^\\.]+\\..+',
  emailDGCCRF: '^[^@]+@[a-zA-Z0-9_\\-.]*\\.gouv\\.fr',
  yyyyMMdd: '\\d{4}-(0\\d|1[0-2])-([0-2]\\d|3[0-1])',
}

export const regexp = Object.entries(regexpPattern).reduce(
  (acc, [key, value]) => ({...acc, [key]: new RegExp(value)}),
  {} as {[key in keyof typeof regexpPattern]: RegExp},
)
