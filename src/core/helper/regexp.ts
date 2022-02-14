export const regexpPattern = {
  email: "^[a-zA-Z0-9_!#$'%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$",
  emailDGCCRF: '^[^@]+@[a-zA-Z0-9_\\-.]*\\.gouv\\.fr',
  yyyyMMdd: '\\d{4}-(0\\d|1[0-2])-([0-2]\\d|3[0-1])',
  siren: '[0-9]{9}',
  siret: '[0-9]{14}',
  activationCode: '[0-9]{6}',
}

export const regexp = Object.entries(regexpPattern).reduce(
  (acc, [key, value]) => ({...acc, [key]: new RegExp(value)}),
  {} as {[key in keyof typeof regexpPattern]: RegExp},
)
