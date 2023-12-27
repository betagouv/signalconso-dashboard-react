import type {UseQueryOptions} from '@tanstack/react-query/src/types'
import {QueryKey} from '@tanstack/query-core'
import {ApiError} from '../client/ApiClient'

export type UseQueryOpts<T, K extends QueryKey> = Omit<UseQueryOptions<T, ApiError, T, K>, 'queryKey' | 'queryFn'>
