import {ApiError, SignalConsoPublicSdk, SignalConsoSecuredSdk} from '../api'
import {useFetcher, UseFetcher} from '@alexandreannic/react-hooks-lib/lib'
import React, {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../../App'

type Sdk = SignalConsoPublicSdk['reportStats']

interface ReportStatsContextProps {
  reportCount: UseFetcher<Sdk['getReportCount'], ApiError>
  monthlyReportCount: UseFetcher<Sdk['getMonthlyReportCount'], ApiError>
  reportForwardedToProPercentage: UseFetcher<Sdk['getReportForwardedToProPercentage'], ApiError>
  reportReadByProPercentage: UseFetcher<Sdk['getReportReadByProPercentage'], ApiError>
  monthlyReportForwardedToProPercentage: UseFetcher<Sdk['getMonthlyReportForwardedToProPercentage'], ApiError>
  monthlyReportReadByProPercentage: UseFetcher<Sdk['getMonthlyReportReadByProPercentage'], ApiError>
  reportWithResponsePercentage: UseFetcher<Sdk['getReportWithResponsePercentage'], ApiError>
  monthlyReportWithResponsePercentage: UseFetcher<Sdk['getMonthlyReportWithResponsePercentage'], ApiError>
  reportWithWebsitePercentage: UseFetcher<Sdk['getReportWithWebsitePercentage'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const ReportStatsContext = React.createContext({} as ReportStatsContextProps)

export const ReportStatsProvider = ({api, children}: Props) => {

  const reportCount = useFetcher(api.public.reportStats.getReportCount)
  const monthlyReportCount = useFetcher(api.public.reportStats.getMonthlyReportCount)
  const reportForwardedToProPercentage = useFetcher(api.public.reportStats.getReportForwardedToProPercentage)
  const reportReadByProPercentage = useFetcher(api.public.reportStats.getReportReadByProPercentage)
  const monthlyReportForwardedToProPercentage = useFetcher(api.public.reportStats.getMonthlyReportForwardedToProPercentage)
  const monthlyReportReadByProPercentage = useFetcher(api.public.reportStats.getMonthlyReportReadByProPercentage)
  const reportWithResponsePercentage = useFetcher(api.public.reportStats.getReportWithResponsePercentage)
  const monthlyReportWithResponsePercentage = useFetcher(api.public.reportStats.getMonthlyReportWithResponsePercentage)
  const reportWithWebsitePercentage = useFetcher(api.public.reportStats.getReportWithWebsitePercentage)

  return (
    <ReportStatsContext.Provider
      value={{
        reportCount,
        monthlyReportCount,
        reportForwardedToProPercentage,
        reportReadByProPercentage,
        monthlyReportForwardedToProPercentage,
        monthlyReportReadByProPercentage,
        reportWithResponsePercentage,
        monthlyReportWithResponsePercentage,
        reportWithWebsitePercentage,
      }}
    >
      {children}
    </ReportStatsContext.Provider>
  )
}

export const useReportStatsContext = (): ReportStatsContextProps => useContext<ReportStatsContextProps>(ReportStatsContext)
