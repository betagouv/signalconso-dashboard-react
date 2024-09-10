export type ValidationRejectReason = 'TOO_MANY_ATTEMPTS' | 'INVALID_CODE'

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
