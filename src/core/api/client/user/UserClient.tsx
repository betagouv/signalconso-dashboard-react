import {ApiClientApi, UserPending, UserSearch} from '../..'
import {User} from './User'
import {paginateData} from '../../../helper/utils'
import {Paginate} from '@alexandreannic/react-hooks-lib/lib'
import {fromNullable} from 'fp-ts/lib/Option'

export class UserClient {

  constructor(private client: ApiClientApi) {
  }

  readonly fetchDGCCRF = (filters: UserSearch): Promise<Paginate<User>> => {
    return this.client.get<User[]>(`/account/dgccrf/users`)
      .then(users => fromNullable(filters.email).map(_ => _ === '' ? users : users.filter(user => user.email.indexOf(_) > 0)).getOrElse(users))
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
    return this.client.get<UserPending[]>(`/account/dgccrf/pending`)
      .then(_ => _.map(_ => {
          _.tokenCreation = new Date(_.tokenCreation)
          _.tokenExpiration = new Date(_.tokenExpiration)
          return _
        })
      )
  }

  readonly inviteDGCCRF = (email: string) => {
    return this.client.post<void>(`/account/dgccrf/invitation`, {body: {email}})
  }
}
