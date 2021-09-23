import {SignalConsoSecuredSdk} from '../api'
import {useFetcher, UseFetcher} from '@alexandreannic/react-hooks-lib/lib'
import React, {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../../App'

type Sdk = SignalConsoSecuredSdk['reportsStats']

interface ReportStatsContextProps {
  reportReadByProMedianDelay: UseFetcher<Sdk['getReportReadByProMedianDelay']>
  reportWithResponseMedianDelay: UseFetcher<Sdk['getReportWithResponseMedianDelay']>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const ReportStatsContext = React.createContext({} as ReportStatsContextProps)

export const ReportStatsProvider = ({api, children}: Props) => {
  const reportReadByProMedianDelay = useFetcher(api.secured.reportsStats.getReportReadByProMedianDelay)
  const reportWithResponseMedianDelay = useFetcher(api.secured.reportsStats.getReportWithResponseMedianDelay)
  return (
    <ReportStatsContext.Provider
      value={{
        reportReadByProMedianDelay,
        reportWithResponseMedianDelay,
      }}
    >
      {children}
    </ReportStatsContext.Provider>
  )
}

export const useReportStatsContext = (): ReportStatsContextProps => useContext<ReportStatsContextProps>(ReportStatsContext)
