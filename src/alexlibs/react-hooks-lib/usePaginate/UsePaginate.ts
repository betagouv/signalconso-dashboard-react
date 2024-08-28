import {Fetch, useFetcher} from '..'
import {Dispatch, SetStateAction, useCallback, useState} from 'react'
import {Paginate} from '../../../core/model'

// export interface Paginate<T> {
//   data: T[]
//   totalSize: number
// }

type OrderBy = 'desc' | 'asc'

interface ISearch<T = any> {
  limit: number
  offset: number
  orderBy?: OrderBy
  sortBy?: keyof T
}

interface UsePaginate<T, S, E = any> {
  list?: Paginate<T>
  error?: E
  fetching: boolean
  fetch: Fetch<(...args: any[]) => Promise<Paginate<T>>>
  filters: S
  updateFilters: (_: SetStateAction<S>, params?: UpdateFiltersParams) => void
  setEntity: Dispatch<SetStateAction<Paginate<T> | undefined>>
  clearFilters: () => void
  pageNumber: number
  initialFilters: S
}

interface UpdateFiltersParams {
  noRefetch?: boolean
  preserveOffset?: boolean
}

const defaultFilters: ISearch = {offset: 0, limit: 25}

const usePaginate = <T, S extends ISearch, E = any>(
  fetcher: (search: S) => Promise<Paginate<T>>,
  initialFilters: S,
  mapError: (_: any) => E = _ => _,
): UsePaginate<T, S, E> => {
  const [filters, setFilters] = useState<S>({...defaultFilters, ...initialFilters})
  const {
    entity: list,
    error,
    loading: fetching,
    fetch,
    setEntity,
    clearCache,
  } = useFetcher<typeof fetcher, E>(fetcher, undefined, mapError)

  const updateFilters = useCallback((update: SetStateAction<S>, {noRefetch, preserveOffset}: UpdateFiltersParams = {}) => {
    setFilters(mutableFilters => {
      const previous = {...mutableFilters}
      const updatedFilters = typeof update === 'function' ? update(mutableFilters) : update
      if (!preserveOffset && previous.offset === updatedFilters.offset && previous.limit === updatedFilters.limit) {
        updatedFilters.offset = 0
      }
      if (!noRefetch) {
        fetch({force: true, clean: false}, updatedFilters)
      }
      return updatedFilters
    })
  }, [])

  const clearFilters = useCallback(() => updateFilters(initialFilters), [])

  return {
    list,
    error,
    fetching,
    fetch: (args: {force?: boolean; clean?: boolean} = {}) => fetch(args, filters),
    filters,
    pageNumber: Math.round(filters.offset / filters.limit),
    updateFilters,
    clearFilters,
    initialFilters,
    setEntity,
  }
}
