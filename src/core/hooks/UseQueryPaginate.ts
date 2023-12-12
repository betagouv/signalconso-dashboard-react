import {SetStateAction, useCallback, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import type {QueryKey} from '@tanstack/query-core'
import {Paginate} from '../model'

export type OrderBy = 'desc' | 'asc'

export interface ISearch<T = any> {
  limit: number
  offset: number
  orderBy?: OrderBy
  sortBy?: keyof T
}

export interface UsePaginate<T, S> {
  list?: Paginate<T>
  isLoading: boolean
  filters: S
  updateFilters: (_: SetStateAction<S>, params?: UpdateFiltersParams) => void
  clearFilters: () => void
  pageNumber: number
  initialFilters: S
}

export interface UpdateFiltersParams {
  preserveOffset?: boolean
}

const defaultFilters: ISearch = {offset: 0, limit: 10}

export const useQueryPaginate = <S extends ISearch, TQueryFnData = unknown, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: (search: S) => Promise<Paginate<TQueryFnData>>,
  initialFilters: S,
): UsePaginate<TQueryFnData, S> => {
  const [filters, setFilters] = useState<S>({...defaultFilters, ...initialFilters})
  const res = useQuery([...queryKey, filters], () => queryFn(filters))

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
    list: res.data,
    isLoading: res.isLoading,
    filters,
    pageNumber: Math.round(filters.offset / filters.limit),
    updateFilters,
    clearFilters,
    initialFilters,
  }
}
