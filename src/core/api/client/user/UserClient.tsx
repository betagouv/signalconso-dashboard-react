import {ApiClientApi, PaginatedFilters, UserPending} from '../..'
import {User} from './User'
import {paginateData} from '../../../helper/utils'
import {Paginate} from '@alexandreannic/react-hooks-lib/lib'

export class UserClient {

  constructor(private client: ApiClientApi) {
  }

  readonly fetchDGCCRF = (tableSearch: PaginatedFilters): Promise<Paginate<User>> => {
    return this.client.get<User[]>(`/account/dgccrf/users`)
      .then(paginateData(tableSearch.limit, tableSearch.offset))
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
