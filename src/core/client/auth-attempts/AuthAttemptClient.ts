import { cleanObject } from '../../helper'
import { Paginate, PaginatedData, PaginatedFilters } from '../../model'
import { ApiClient } from '../ApiClient'
import { AuthAttempt } from './AuthAttempt'

export interface AuthAttemptsSearch extends PaginatedFilters {
  login?: string
}

export class AuthAttemptClient {
  constructor(private client: ApiClient) {}

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
