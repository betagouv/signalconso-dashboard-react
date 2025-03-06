import type { QueryKey } from '@tanstack/query-core'
import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query/src/types'
import { SetStateAction, useCallback, useState } from 'react'
import { Paginate, PaginatedFilters } from '../model'

export interface UseQueryPaginateResult<S, T, E> {
  result: UseQueryResult<T, E>
  filters: S
  updateFilters: (_: SetStateAction<S>, params?: UpdateFiltersParams) => void
  clearFilters: () => void
  enable: () => void
  defaultFilters: S
  initialFilters?: S
  pageNumber: number
}

interface UpdateFiltersParams {
  preserveOffset?: boolean
}

export const useQueryPaginate = <
  S extends PaginatedFilters,
  T = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: (search: S) => Promise<Paginate<T>>,
  defaultFilters: S,
  initialFilters?: S,
  initiallyEnabled?: boolean,
): UseQueryPaginateResult<S, Paginate<T>, unknown> => {
  const [filters, setFilters] = useState<S>({
    ...defaultFilters,
    ...initialFilters,
  })
  const [enabled, setEnabled] = useState<boolean>(initiallyEnabled ?? true)

  const updateFilters = useCallback(
    (
      update: SetStateAction<S>,
      { preserveOffset }: UpdateFiltersParams = {},
    ) => {
      setFilters((mutableFilters) => {
        const previous = { ...mutableFilters }
        const updatedFilters =
          typeof update === 'function' ? update(mutableFilters) : update
        if (
          !preserveOffset &&
          previous.offset === updatedFilters.offset &&
          previous.limit === updatedFilters.limit
        ) {
          updatedFilters.offset = 0
        }
        return updatedFilters
      })
    },
    [],
  )

  const clearFilters = useCallback(
    () => updateFilters(defaultFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const enable = useCallback(() => setEnabled(true), [])

  const result = useQuery({
    queryKey: [...queryKey, filters],
    queryFn: () => queryFn(filters),
    enabled,
  })

  return {
    result,
    filters,
    updateFilters,
    clearFilters,
    enable,
    defaultFilters,
    initialFilters,
    pageNumber: Math.round(filters.offset / filters.limit),
  }
}
