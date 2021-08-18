import {ApiClientApi, UserPending, UserSearch, UserUpdate} from '../..'
import {User} from './User'
import {paginateData} from '../../../helper/utils'
import {Paginate} from '@alexandreannic/react-hooks-lib/lib'
import {fromNullable} from 'fp-ts/lib/Option'

export class UserClient {
  constructor(private client: ApiClientApi) {}

  readonly fetchConnectedUser = () => {
    return this.client.get<User>(`/account`)
  }

  readonly patchConnectedUser = (userUpdate: UserUpdate) => {
    return this.client.patch<User>(`/account`, {body: userUpdate})
  }

  readonly fetchDGCCRF = (filters: UserSearch): Promise<Paginate<User>> => {
    return this.client.get<User[]>(`/account/dgccrf/users`)
      .then(users =>
        fromNullable(filters.email)
          .filter(_ => _ !== '')
          .map(user => users.filter(_ => _.email.includes(user)))
          .getOrElse(users),
      )
      .then(paginateData(filters.limit, filters.offset))
      .then(result => {
        result.data = result.data.map(_ => {
          _.lastEmailValidation = new Date(_.lastEmailValidation)
          return _
        })
        return result
      })
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

  readonly changePassword = (oldPassword: string, newPassword: string) => {
    return this.client.post(`/account/password`, {body: {oldPassword, newPassword}})
  }
}
