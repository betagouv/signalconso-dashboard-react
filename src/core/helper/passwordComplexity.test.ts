import { validatePasswordComplexity } from './passwordComplexity'

describe('validate password complexity', () => {
  test('complex password should pass', () => {
    expect(validatePasswordComplexity('p@ssWord1234')).toBeUndefined()
  })

  test('without enough chars should not pass', () => {
    expect(validatePasswordComplexity('p@W4')).toBe('passwordNeedToBeLong')
  })

  test('without special char should not pass', () => {
    expect(validatePasswordComplexity('passWord1234')).toBe(
      'passwordNeedToContainSpecialChar',
    )
  })

  test('without uppercase should not pass', () => {
    expect(validatePasswordComplexity('p@ssword1234')).toBe(
      'passwordNeedToContainUppercase',
    )
  })

  test('without lowercase should not pass', () => {
    expect(validatePasswordComplexity('P@SSWORD1234')).toBe(
      'passwordNeedToContainLowercase',
    )
  })

  test('without numbers should not pass', () => {
    expect(validatePasswordComplexity('p@ssWordnonumbers')).toBe(
      'passwordNeedToContainNumber',
    )
  })

  test('uppercase or lowercase with accents should be counted', () => {
    expect(validatePasswordComplexity('Éñ123456789-//-')).toBeUndefined()
  })
})
