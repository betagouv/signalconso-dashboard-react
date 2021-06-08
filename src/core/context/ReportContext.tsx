import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetchableReturn, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {ReportEvent, ReportSearchResult} from 'core/api'

export interface ReportContextProps extends UseFetchableReturn<ReportSearchResult> {
  events: UseFetchableReturn<ReportEvent[]>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportContextProps> = {}

const ReportContext = React.createContext<ReportContextProps>(defaultContext as ReportContextProps)

export const ReportProvider = ({api, children}: Props) => {

  const _report = useFetcher<ReportSearchResult>(api.secured.reports.getById)
  const _events = useFetcher<ReportEvent[]>(api.secured.events.getByReportId)

  return (
    <ReportContext.Provider value={{
      ..._report,
      events: _events,
    }}>
      {children}
    </ReportContext.Provider>
  )
}

export const useReportContext = (): ReportContextProps => {
  return useContext<ReportContextProps>(ReportContext)
}
