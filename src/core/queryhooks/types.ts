import type {UseQueryOptions} from '@tanstack/react-query/src/types'
import {QueryKey} from '@tanstack/query-core'

export type UseQueryOpts<T, K extends QueryKey> = Omit<UseQueryOptions<T, unknown, T, K>, 'queryKey' | 'queryFn'>
