import {PaginatedFilters} from '../../model'
import {subMonths} from 'date-fns'

export type RoleAdminOrDggcrfOrDgal = 'Admin' | 'DGCCRF' | 'DGAL'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  lastEmailValidation: Date
  role: RoleAdminOrDggcrfOrDgal
}

export type UserRaw = Omit<User, 'lastEmailValidation'> & {
  lastEmailValidation: string
}

export const isUserActive = (user: User) => user.lastEmailValidation.getTime() > subMonths(new Date(), 3).getTime()

export interface UserEdit {
  firstName?: string
  lastName?: string
}

export interface UserPending {
  email: string
  token: string
  tokenCreation: Date
  tokenExpiration: Date
}

export interface UserSearch extends PaginatedFilters {
  role?: RoleAdminOrDggcrfOrDgal
  email?: string
  active?: boolean
}

export interface UserToActivate {
  email: string
  firstName: string
  lastName: string
  password: string
}
