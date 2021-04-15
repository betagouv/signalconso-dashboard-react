import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {usePaginate, UsePaginate} from '@alexandreannic/react-hooks-lib/lib'
import {ApiSecuredSdk, Report, ReportFilter} from '@signalconso/signalconso-api-sdk-js'

export interface ReportsContextProps extends UsePaginate<Report, ReportFilter> {
}

interface Props {
  children: ReactNode
  apiSecuredSdk: ApiSecuredSdk
}

const defaultContext: Partial<ReportsContextProps> = {}

const ReportsContext = React.createContext<ReportsContextProps>(defaultContext as ReportsContextProps)

export const ReportsProvider = ({apiSecuredSdk, children}: Props) => {

  const _paginate = usePaginate<Report, ReportFilter>(
    (_: ReportFilter) => apiSecuredSdk.reports.search(_).then(_ => ({data: _.entities, totalSize: _.totalCount}))
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
