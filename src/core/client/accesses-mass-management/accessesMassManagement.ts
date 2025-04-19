import { CompanyAccessTokenWithEmail } from '../company-access-token/CompanyAccessToken'
import { User } from '../user/User'

export type AccessesMassManagementUsers = {
  users: User[]
  invitedByEmail: CompanyAccessTokenWithEmail[]
}
