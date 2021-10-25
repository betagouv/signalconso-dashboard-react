import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {mapSdkPaginate} from '../helper/utils'
import {ApiClient, ReportSearch, ReportSearchResult, toQueryString} from '@signal-conso/signalconso-api-sdk-js'
import {DgccrfEventActions, EventCategories, Matomo} from '../plugins/Matomo'

export interface ReportsContextProps extends UsePaginate<ReportSearchResult, ReportSearch> {
  extract: (_?: ReportSearch) => Promise<void>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportsContextProps> = {}

const ReportsContext = React.createContext<ReportsContextProps>(defaultContext as ReportsContextProps)

export const ReportsProvider = ({api, children}: Props) => {
  const _paginate = usePaginate<ReportSearchResult, ReportSearch>((search: ReportSearch) => {
    Matomo.trackEvent(EventCategories.dgccrf, DgccrfEventActions.reportsSearch, 'querystring', toQueryString(search))
    return api.secured.reports.search(search).then(mapSdkPaginate)
  }, {
    limit: 10,
    offset: 0,
  })

  return (
    <ReportsContext.Provider
      value={{
        ..._paginate,
        extract: () => api.secured.reports.extract(_paginate.filters),
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export const useReportsContext = (): ReportsContextProps => {
  return useContext<ReportsContextProps>(ReportsContext)
}
