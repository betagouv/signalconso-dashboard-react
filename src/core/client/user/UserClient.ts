import {isUserActive, RoleAgents, User, UserEdit, UserPending, UserRaw, UserSearch} from './User'
import {ApiClientApi} from '../ApiClient'
import {Id, Paginate} from '../../model'
import {paginateData} from '../../helper'

export class UserClient {
  constructor(private client: ApiClientApi) {}

  readonly fetchConnectedUser = () => {
    return this.client.get<User>(`/account`)
  }

  readonly searchAdminOrAgent = async (filters: UserSearch): Promise<Paginate<User>> => {
    const rawUsers = await this.client.get<UserRaw[]>(`/account/admin-or-agent/users`)
    const users: User[] = rawUsers
      .map(({lastEmailValidation, ...rest}) => {
        return {
          lastEmailValidation: new Date(lastEmailValidation),
          ...rest,
        }
      })
      .filter(_ => {
        return !filters.email || _.email.toLowerCase().includes(filters.email.toLowerCase())
      })
      .filter(_ => {
        return filters.active === undefined || isUserActive(_) === filters.active
      })
      .filter(_ => {
        return !filters.role || filters.role.length === 0 || filters.role.includes(_.role)
      })
    return paginateData<User>(filters.limit, filters.offset)(users)
  }

  readonly fetchPendingAgent = (role?: RoleAgents) => {
    const url = role ? `/account/agent/pending?role=${role}` : '/account/agent/pending'
    return this.client.get<UserPending[]>(url).then(_ =>
      _.map(_ => {
        _.tokenCreation = new Date(_.tokenCreation)
        _.tokenExpiration = new Date(_.tokenExpiration)
        return _
      }),
    )
  }

  readonly inviteDGCCRF = (email: string) => {
    return this.client.post<void>(`/account/agent/invitation?role=DGCCRF`, {body: {email}})
  }

  readonly inviteDGAL = (email: string) => {
    return this.client.post<void>(`/account/agent/invitation?role=DGAL`, {body: {email}})
  }

  readonly inviteAdmin = (email: string) => {
    return this.client.post<void>(`/account/admin/invitation`, {body: {email}})
  }

  readonly changePassword = (oldPassword: string, newPassword: string) => {
    return this.client.post(`/account/password`, {body: {oldPassword, newPassword}})
  }

  readonly forceValidateEmail = (email: string) => {
    return this.client.post<void>(`/account/validate-email/${email}`, {})
  }

  readonly edit = (body: UserEdit) => {
    return this.client.put<User>(`/account`, {body})
  }

  readonly softDelete = (id: Id) => {
    return this.client.delete<void>(`/account/${id}`)
  }
}
