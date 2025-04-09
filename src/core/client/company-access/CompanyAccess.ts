export enum CompanyAccessLevel {
  admin = 'Administrateur',
  member = 'Accès simple',
}

export function translateCompanyAccessLevel(level: CompanyAccessLevel) {
  return (CompanyAccessLevel as any)[level]
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
