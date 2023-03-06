import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {useFetcher, UseFetcher, UsePaginate} from '../../alexlibs/react-hooks-lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {useScPaginate} from '../../shared/usePaginate/usePaginate'
import {PaginatedFilters, ReportSearch, ReportSearchResult} from '../model'
import {ApiError} from '../client/ApiClient'
import {NamedReportSearch} from '../client/report/NamedReportSearch'

export interface ReportsContextProps extends UsePaginate<ReportSearchResult, ReportSearch & PaginatedFilters> {
  extract: (_?: ReportSearch) => Promise<void>

  saveFilters: UseFetcher<SignalConsoApiSdk['secured']['reports']['saveFilters'], ApiError>
  getSavedFilters: UseFetcher<SignalConsoApiSdk['secured']['reports']['getSavedFilters'], ApiError>
  listSavedFilters: UseFetcher<SignalConsoApiSdk['secured']['reports']['listSavedFilters'], ApiError>
  deleteSavedFilters: UseFetcher<SignalConsoApiSdk['secured']['reports']['deleteSavedFilters'], ApiError>
  renameSavedFilters: UseFetcher<SignalConsoApiSdk['secured']['reports']['renameSavedFilters'], ApiError>
  setDefaultFilters: UseFetcher<SignalConsoApiSdk['secured']['reports']['setDefaultFilters'], ApiError>
  unsetDefaultFilters: UseFetcher<SignalConsoApiSdk['secured']['reports']['unsetDefaultFilters'], ApiError>
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

  const saveFilters = useFetcher((filters: NamedReportSearch) =>
    api.secured.reports.saveFilters(filters).then(_ => listSavedFilters.fetch({})),
  )
  const getSavedFilters = useFetcher(api.secured.reports.getSavedFilters)
  const listSavedFilters = useFetcher(api.secured.reports.listSavedFilters)
  const deleteSavedFilters = useFetcher((name: string) =>
    api.secured.reports.deleteSavedFilters(name).then(_ => listSavedFilters.fetch({})),
  )
  const renameSavedFilters = useFetcher((oldName: string, newName: string) =>
    api.secured.reports.renameSavedFilters(oldName, newName).then(_ => listSavedFilters.fetch({})),
  )
  const setDefaultFilters = useFetcher((name: string) =>
    api.secured.reports.setDefaultFilters(name).then(_ => listSavedFilters.fetch({})),
  )
  const unsetDefaultFilters = useFetcher((name: string) =>
    api.secured.reports.unsetDefaultFilters(name).then(_ => listSavedFilters.fetch({})),
  )

  return (
    <ReportsContext.Provider
      value={{
        ..._paginate,
        extract: () => api.secured.reports.extract(_paginate.filters),
        saveFilters,
        getSavedFilters,
        listSavedFilters,
        deleteSavedFilters,
        renameSavedFilters,
        setDefaultFilters,
        unsetDefaultFilters,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export const useReportsContext = (): ReportsContextProps => {
  return useContext<ReportsContextProps>(ReportsContext)
}
