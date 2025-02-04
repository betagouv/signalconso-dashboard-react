export enum CompanyAccessLevel {
  admin = 'Administrateur',
  member = 'Accès simple',
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
