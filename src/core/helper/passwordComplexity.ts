function normalizeAccents(s: string) {
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function containsSpecialChars(s: string) {
  const list = `'-!"#$%&()*,./:;?@[]^_\`{|}~+<=>`
  return list.split('').some((_) => s.includes(_))
}

export function validatePasswordComplexity(str: string) {
  const s = normalizeAccents(str)
  if (!/[a-z]/.test(s)) {
    return 'passwordNeedToContainLowercase'
  }
  if (!/[A-Z]/.test(s)) {
    return 'passwordNeedToContainUppercase'
  }
  if (!/[0-9]/.test(s)) {
    return 'passwordNeedToContainNumber'
  }
  if (!containsSpecialChars(s)) {
    return 'passwordNeedToContainSpecialChar'
  }
  if (s.length < 12) {
    return 'passwordNeedToBeLong'
  }
}
