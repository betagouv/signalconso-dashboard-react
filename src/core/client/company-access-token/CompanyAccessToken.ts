import { Id } from '../../model'
import { CompanyAccessLevel } from '../company-access/CompanyAccess'

export interface CompanyAccessToken {
  id: Id
  level: CompanyAccessLevel
  emailedTo?: string
  expirationDate: Date
  token?: string
}

export function getCompanyAccessTokenKind(token: CompanyAccessToken) {
  return token.emailedTo ? 'email' : 'postal'
}
