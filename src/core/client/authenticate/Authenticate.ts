export type ValidationRejectReason = 'TOO_MANY_ATTEMPTS' | 'INVALID_CODE'

export interface UserWithPermission {
  id: string
  login: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: Roles
  permissions: Permissions[] // field seems unused. Could probably merge User and UserWithPermission
}

export enum Roles {
  Admin = 'Admin',
  DGCCRF = 'DGCCRF',
  DGAL = 'DGAL',
  Pro = 'Professionnel',
  ToActivate = 'ToActivate',
}

enum TokenKind {
  companyInit = 'COMPANY_INIT',
  companyJoin = 'COMPANY_JOIN',
  dgccrfAccount = 'DGCCRF_ACCOUNT',
  dgalAccount = 'DGAL_ACCOUNT',
}

export interface TokenInfo {
  token: string
  kind: TokenKind
  emailedTo: string
}

enum Permissions {
  listReports = 'listReports',
  updateReport = 'updateReport',
  deleteReport = 'deleteReport',
  deleteFile = 'deleteFile',
  createEvent = 'createEvent',
  editDocuments = 'editDocuments',
  subscribeReports = 'subscribeReports',
  updateCompany = 'updateCompany',
}
