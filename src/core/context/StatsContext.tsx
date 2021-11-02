import {ApiError, ReportStatus, SignalConsoPublicSdk, SignalConsoSecuredSdk} from '@signal-conso/signalconso-api-sdk-js'
import {useFetcher, UseFetcher} from '@alexandreannic/react-hooks-lib/lib'
import React, {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {CurveStatsParamsWithPeriod} from '@signal-conso/signalconso-api-sdk-js/lib/client/stats/PublicStatsClient'

type PublicSdk = SignalConsoPublicSdk['stats']
type SecuredSdk = SignalConsoSecuredSdk['stats']

interface StatsContextProps {
  reportCount: UseFetcher<PublicSdk['getReportCount'], ApiError>
  tags: UseFetcher<SecuredSdk['getTags'], ApiError>
  status: UseFetcher<SecuredSdk['getStatus'], ApiError>
  responseReviews: UseFetcher<SecuredSdk['getResponseReviews'], ApiError>
  readDelay: UseFetcher<SecuredSdk['getReadDelay'], ApiError>
  responseDelay: UseFetcher<SecuredSdk['getResponseDelay'], ApiError>
  curve: {
    reportCount: UseFetcher<PublicSdk['curve']['getReportCount'], ApiError>
    reportRespondedCount: UseFetcher<PublicSdk['curve']['getReportCount'], ApiError>
    reportForwardedPercentage: UseFetcher<PublicSdk['curve']['getReportForwardedPercentage'], ApiError>
    reportRespondedPercentage: UseFetcher<PublicSdk['curve']['getReportRespondedPercentage'], ApiError>
    reportReadPercentage: UseFetcher<PublicSdk['curve']['getReportReadPercentage'], ApiError>
  }
  percentage: {
    reportForwardedToPro: UseFetcher<PublicSdk['percentage']['getReportForwardedToPro'], ApiError>
    reportReadByPro: UseFetcher<PublicSdk['percentage']['getReportReadByPro'], ApiError>
    reportWithResponse: UseFetcher<PublicSdk['percentage']['getReportWithResponse'], ApiError>
    reportWithWebsite: UseFetcher<PublicSdk['percentage']['getReportWithWebsite'], ApiError>
  }
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const StatsContext = React.createContext({} as StatsContextProps)

export const StatsProvider = ({api, children}: Props) => {
  const reportCount = useFetcher(api.public.stats.getReportCount)
  const tags = useFetcher(api.secured.stats.getTags)
  const status = useFetcher(api.secured.stats.getStatus)
  const responseReviews = useFetcher(api.secured.stats.getResponseReviews)
  const readDelay = useFetcher(api.secured.stats.getReadDelay)
  const responseDelay = useFetcher(api.secured.stats.getResponseDelay)
  const curve = {
    reportCount: useFetcher(api.public.stats.curve.getReportCount),
    reportRespondedCount: useFetcher((_: CurveStatsParamsWithPeriod) => {
      const status = [ReportStatus.Accepted, ReportStatus.Rejected, ReportStatus.NotConcerned]
      return api.public.stats.curve.getReportCount({status, ..._})
    }),
    reportForwardedPercentage: useFetcher(api.public.stats.curve.getReportForwardedPercentage),
    reportRespondedPercentage: useFetcher(api.public.stats.curve.getReportRespondedPercentage),
    reportReadPercentage: useFetcher(api.public.stats.curve.getReportReadPercentage),
  }
  const percentage = {
    reportForwardedToPro: useFetcher(api.public.stats.percentage.getReportForwardedToPro),
    reportReadByPro: useFetcher(api.public.stats.percentage.getReportReadByPro),
    reportWithResponse: useFetcher(api.public.stats.percentage.getReportWithResponse),
    reportWithWebsite: useFetcher(api.public.stats.percentage.getReportWithWebsite),
  }

  return (
    <StatsContext.Provider
      value={{
        reportCount,
        tags,
        status,
        responseReviews,
        readDelay,
        responseDelay,
        curve,
        percentage,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export const useStatsContext = (): StatsContextProps => useContext<StatsContextProps>(StatsContext)
