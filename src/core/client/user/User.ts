import {PaginatedFilters} from '../../model'
import {subMonths} from 'date-fns'

export const roleAgents = ['DGCCRF', 'DGAL'] as const
export type RoleAgents = typeof roleAgents[number]
export type RoleAdminOrAgent = 'Admin' | RoleAgents

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  lastEmailValidation: Date
  role: RoleAdminOrAgent
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
  role: RoleAgents
  email: string
  token: string
  tokenCreation: Date
  tokenExpiration: Date
}

export interface UserSearch extends PaginatedFilters {
  role?: RoleAdminOrAgent[]
  email?: string
  active?: boolean
}

export interface UserToActivate {
  email: string
  firstName: string
  lastName: string
  password: string
}
