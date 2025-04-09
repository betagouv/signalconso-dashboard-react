import { AccessLevel } from 'core/model'

export const companyAccessLevelsCreatable = ['admin', 'member'] as const
export type CompanyAccessLevelCreatable =
  (typeof companyAccessLevelsCreatable)[number]

const companyAccessLevelsAll = [
  ...companyAccessLevelsCreatable,
  'none',
] as const
export type CompanyAccessLevel = (typeof companyAccessLevelsAll)[number]

export function translateCompanyAccessLevel(level: CompanyAccessLevel) {
  switch (level) {
    case 'admin':
      return 'Administrateur'
    case 'member':
      return 'Accès simple'
    case 'none':
      return undefined
    default:
      return level satisfies never
  }
}
export function translateAccessLevel(level: AccessLevel) {
  switch (level) {
    case AccessLevel.ADMIN:
      return 'Administrateur'
    case AccessLevel.MEMBER:
      return 'Accès simple'
    case AccessLevel.NONE:
      return undefined
    default:
      return level satisfies never
  }
}

export interface CompanyAccess {
  userId: string
  firstName: string
  lastName: string
  email: string
  level: CompanyAccessLevel
  editable: boolean
  isHeadOffice: boolean
}

export type CompanyAccessMostActive = CompanyAccess & {
  nbResponses: number
}
