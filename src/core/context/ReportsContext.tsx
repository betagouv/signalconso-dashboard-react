import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {Report, ReportFilter} from '@signalconso/signalconso-api-sdk-js'
import {SignalConsoApiSdk} from '../../App'
import {ReportSearchResult} from '@signalconso/signalconso-api-sdk-js/build'

export interface ReportsContextProps extends UsePaginate<ReportSearchResult, ReportFilter> {
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
    <ReportsContext.Provider value={_paginate}>
      {children}
    </ReportsContext.Provider>
  )
}

export const useReportsContext = (): ReportsContextProps => {
  return useContext<ReportsContextProps>(ReportsContext)
}
