import { Paginate, PaginatedData, PaginatedFilters } from '../../model'
import { cleanObject } from '../../helper'
import { ApiClientApi } from '../ApiClient'
import { AuthAttempt } from './AuthAttempt'

export interface AuthAttemptsSearch extends PaginatedFilters {
  login?: string
}

export class AuthAttemptClient {
  constructor(private client: ApiClientApi) {}

  readonly fetch = ({
    limit,
    offset,
    login,
  }: AuthAttemptsSearch): Promise<Paginate<AuthAttempt>> => {
    return this.client.get<PaginatedData<AuthAttempt>>('/auth-attempts', {
      qs: cleanObject({ login, limit, offset }),
    })
  }
}
