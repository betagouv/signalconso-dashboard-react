import {SetStateAction, useCallback, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import type {QueryKey} from '@tanstack/query-core'
import {Paginate} from '../model'
import type {UseQueryResult} from '@tanstack/react-query/src/types'
import {UseQueryOpts} from './types'

export type OrderBy = 'desc' | 'asc'

export interface ISearch<T = any> {
  limit: number
  offset: number
  orderBy?: OrderBy
  sortBy?: keyof T
}

export interface UseQueryPaginateResult<S, T, E> {
  result: UseQueryResult<T, E>
  filters: S
  updateFilters: (_: SetStateAction<S>, params?: UpdateFiltersParams) => void
  clearFilters: () => void
  initialFilters: S
  pageNumber: number
}

export interface UpdateFiltersParams {
  preserveOffset?: boolean
}

const defaultFilters: ISearch = {offset: 0, limit: 10}

export const useQueryPaginate = <S extends ISearch, T = unknown, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: (search: S) => Promise<Paginate<T>>,
  initialFilters: S,
  options?: UseQueryOpts<Paginate<T>, any[]>,
): UseQueryPaginateResult<S, Paginate<T>, unknown> => {
  const [filters, setFilters] = useState<S>({...defaultFilters, ...initialFilters})
  const result = useQuery({queryKey: [...queryKey, filters], queryFn: () => queryFn(filters), ...options})

  const updateFilters = useCallback((update: SetStateAction<S>, {preserveOffset}: UpdateFiltersParams = {}) => {
    setFilters(mutableFilters => {
      const previous = {...mutableFilters}
      const updatedFilters = typeof update === 'function' ? update(mutableFilters) : update
      if (!preserveOffset && previous.offset === updatedFilters.offset && previous.limit === updatedFilters.limit) {
        updatedFilters.offset = 0
      }
      return updatedFilters
    })
  }, [])

  const clearFilters = useCallback(() => updateFilters(initialFilters), [])

  return {
    result,
    filters,
    updateFilters,
    clearFilters,
    initialFilters,
    pageNumber: Math.round(filters.offset / filters.limit),
  }
}
