export enum CompanyAccessLevel {
  member = 'Accès simple',
  admin = 'Administrateur'
}

export interface CompanyAccess {
  userId: string
  firstName: string
  lastName: string
  email: string
  level: CompanyAccessLevel
}
