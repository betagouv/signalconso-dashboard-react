import { subMonths } from 'date-fns'
import { CompanyAccess, PaginatedFilters } from '../../model'

export const roleAgents = ['DGCCRF', 'DGAL'] as const
export type RoleAgents = (typeof roleAgents)[number]
export const roleAdmins = ['SuperAdmin', 'Admin', 'ReadOnlyAdmin'] as const
export type RoleAdmins = (typeof roleAdmins)[number]
export type RoleAdminOrAgent = RoleAdmins | RoleAgents
export type Role = RoleAdminOrAgent | 'Professionnel'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  lastEmailValidation: Date
  role: Role
}

export class User {
  static buildFullName(user: User | CompanyAccess | MinimalUser) {
    return `${user.firstName} ${user.lastName}`
  }
}

export type UserRaw = Omit<User, 'lastEmailValidation'> & {
  lastEmailValidation: string
}

export type MinimalUser = {
  id: string
  firstName: string
  lastName: string
}

export const isUserActive = (user: User) =>
  user.lastEmailValidation.getTime() > subMonths(new Date(), 3).getTime()

export interface UserEdit {
  firstName?: string
  lastName?: string
}

export interface UserPending {
  role: RoleAgents
  email: string
  token: string
  tokenCreation: Date
  tokenExpiration: Date
}

export interface UserSearch extends PaginatedFilters {
  role?: RoleAgents[]
  email?: string
  active?: boolean
}

export interface UserToActivate {
  email: string
  firstName: string
  lastName: string
  password: string
}
