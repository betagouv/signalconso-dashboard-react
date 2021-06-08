export interface User {
  id: string
  login: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: Roles
  permissions: Permissions[]
}

export enum Roles {
  Admin = 'Admin',
  DGCCRF = 'DGCCRF',
  Pro = 'Professionnel',
  ToActivate = 'ToActivate'
}

export const roleUrlParam = (_: User): string => {
  switch (_.role) {
    case Roles.Admin:
      return 'admin'
    case Roles.DGCCRF:
      return 'dgccrf'
    case Roles.Pro:
      return 'pro'
    default:
      return ''
  }
}

export interface AuthUser {
  token: string
  user: User
}

export enum TokenKind {
  companyInit = 'COMPANY_INIT',
  companyJoin = 'COMPANY_JOIN',
  dgccrfAccount = 'DGCCRF_ACCOUNT',
}


export interface TokenInfo {
  token: string
  kind: TokenKind
  timestamp: Date
  companySiret?: string
  emailedTo?: string
}

export enum Permissions {
  listReports = 'listReports',
  updateReport = 'updateReport',
  deleteReport = 'deleteReport',
  deleteFile = 'deleteFile',
  createEvent = 'createEvent',
  editDocuments = 'editDocuments',
  subscribeReports = 'subscribeReports',
  updateCompany = 'updateCompany'
}
