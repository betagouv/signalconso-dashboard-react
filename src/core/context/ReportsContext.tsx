import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {useFetcher, UseFetcher, UsePaginate} from '../../alexlibs/react-hooks-lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {useScPaginate} from '../../shared/usePaginate/usePaginate'
import {PaginatedFilters, ReportSearch, ReportSearchResult} from '../model'
import {ApiError} from '../client/ApiClient'

export interface ReportsContextProps extends UsePaginate<ReportSearchResult, ReportSearch & PaginatedFilters> {
  extract: (_?: ReportSearch) => Promise<void>

  saveFilters: UseFetcher<SignalConsoApiSdk['secured']['reports']['saveFilters'], ApiError> //(r: ReportSearch) => Promise<void>

  getFilters: () => Promise<ReportSearch>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportsContextProps> = {}

const ReportsContext = React.createContext<ReportsContextProps>(defaultContext as ReportsContextProps)

export const ReportsProvider = ({api, children}: Props) => {
  const _paginate = useScPaginate<ReportSearchResult, ReportSearch & PaginatedFilters>(api.secured.reports.search, {
    limit: 10,
    offset: 0,
  })

  const saveFilters = useFetcher(api.secured.reports.saveFilters)

  return (
    <ReportsContext.Provider
      value={{
        ..._paginate,
        extract: () => api.secured.reports.extract(_paginate.filters),
        saveFilters: saveFilters,
        getFilters: () => api.secured.reports.getFilters(),
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export const useReportsContext = (): ReportsContextProps => {
  return useContext<ReportsContextProps>(ReportsContext)
}
