import {CompanyAccessLevel, Id} from '../..'

export interface CompanyAccessToken {
  id: Id
  level: CompanyAccessLevel
  emailedTo?: string
  expirationDate: Date
}
