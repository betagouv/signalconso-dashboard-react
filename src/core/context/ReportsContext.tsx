import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {ReportFilter, ReportSearchResult} from 'core/api'
import {SignalConsoApiSdk} from '../../App'

export interface ReportsContextProps extends UsePaginate<ReportSearchResult, ReportFilter> {
  extract: (_?: ReportFilter) => Promise<void>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportsContextProps> = {}

const ReportsContext = React.createContext<ReportsContextProps>(defaultContext as ReportsContextProps)

export const ReportsProvider = ({api, children}: Props) => {

  const _paginate = usePaginate<ReportSearchResult, ReportFilter>(
    (_: ReportFilter) => api.secured.reports.search(_).then(_ => ({data: _.entities, totalSize: _.totalCount})),
    {limit: 10, offset: 0}
  )

  return (
    <ReportsContext.Provider value={{
      ..._paginate,
      extract: () => api.secured.reports.extract(_paginate.filters),
    }}>
      {children}
    </ReportsContext.Provider>
  )
}

export const useReportsContext = (): ReportsContextProps => {
  return useContext<ReportsContextProps>(ReportsContext)
}
