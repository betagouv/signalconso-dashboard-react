import {CurveStatsParams, Id} from '@signal-conso/signalconso-api-sdk-js'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import React from 'react'
import {useLogin} from '../../core/context/LoginContext'

export const useCompanyStats = (id: Id) => {
  const {apiSdk: api} = useLogin()
  return {
    reportCount: useFetcher(() => api.public.stats.getReportCount({companyIds: [id]})),
    tags: useFetcher(() => api.secured.stats.getTags(id)),
    status: useFetcher(() => api.secured.stats.getStatus(id)),
    responseReviews: useFetcher(() => api.secured.stats.getResponseReviews(id)),
    readDelay: useFetcher(() => api.secured.stats.getReadDelay(id)),
    responseDelay: useFetcher(() => api.secured.stats.getResponseDelay(id)),
    curve: {
      reportCount: useFetcher((_: CurveStatsParams) => api.public.stats.getReportCountCurve({companyIds: [id], ..._})),
      reportRespondedCount: useFetcher((_: CurveStatsParams) => api.public.stats.curve.getReportRespondedPercentage({companyId: id, ..._})),
      reportForwardedPercentage: useFetcher((_: CurveStatsParams) => api.public.stats.curve.getReportForwardedPercentage({companyId: id, ..._})),
      reportRespondedPercentage: useFetcher((_: CurveStatsParams) => api.public.stats.curve.getReportRespondedPercentage({companyId: id, ..._})),
      reportReadPercentage: useFetcher((_: CurveStatsParams) => api.public.stats.curve.getReportReadPercentage({companyId: id, ..._})),
    },
    percentage: {
      reportForwardedToPro: useFetcher(() => api.public.stats.percentage.getReportForwardedToPro(id)),
      reportReadByPro: useFetcher(() => api.public.stats.percentage.getReportReadByPro(id)),
      reportWithResponse: useFetcher(() => api.public.stats.percentage.getReportWithResponse(id)),
      reportWithWebsite: useFetcher(() => api.public.stats.percentage.getReportWithWebsite(id)),
    },
  }
}
