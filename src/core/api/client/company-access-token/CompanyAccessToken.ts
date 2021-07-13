import {CompanyAccessLevel} from '../..'

export interface CompanyAccessToken {
  id: string
  level: CompanyAccessLevel
  emailedTo: string
  expirationDate: Date
}
