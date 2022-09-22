import {isUserActive, User, UserEdit, UserPending, UserRaw, UserSearch} from './User'
import {ApiClientApi} from '../ApiClient'
import {Id, Paginate} from '../../model'
import {paginateData} from '../../helper'

export class UserClient {
  constructor(private client: ApiClientApi) {}

  readonly fetchConnectedUser = () => {
    return this.client.get<User>(`/account`)
  }

  readonly searchAdminOrDgccrf = async (filters: UserSearch): Promise<Paginate<User>> => {
    const rawUsers = await this.client.get<UserRaw[]>(`/account/admin-or-dgccrf/users`)
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
        return !filters.role || _.role === filters.role
      })
    return paginateData<User>(filters.limit, filters.offset)(users)
  }

  readonly fetchPendingDGCCRF = () => {
    return this.client.get<UserPending[]>(`/account/dgccrf/pending`).then(_ =>
      _.map(_ => {
        _.tokenCreation = new Date(_.tokenCreation)
        _.tokenExpiration = new Date(_.tokenExpiration)
        return _
      }),
    )
  }

  readonly inviteDGCCRF = (email: string) => {
    return this.client.post<void>(`/account/dgccrf/invitation`, {body: {email}})
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

  readonly edit = (id: Id, body: UserEdit) => {
    return this.client.put<User>(`/account/${id}`, {body})
  }
}
